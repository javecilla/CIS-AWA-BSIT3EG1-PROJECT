import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { ref, get, child } from 'firebase/database'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT, STAFF } from '@/constants/user-roles'
import './Navbar.css'

function Navbar() {
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const formatFullName = (nameObj) => {
    if (!nameObj) return ''

    const { firstName, middleName, lastName, suffix } = nameObj
    const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
    return parts.join(' ')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        try {
          const userRef = child(ref(db), `users/${user.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            const userData = snapshot.val()
            setUserRole(userData.role)
            setUserName(formatFullName(userData.fullName) || user.email)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      } else {
        setUserRole(null)
        setUserName('')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUserRole(null)
      setUserName('')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <nav>
        <div className="text-center py-3">
          <span className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </span>
        </div>
      </nav>
    )
  }

  //if no user is logged in, show yung general nav link
  if (!userRole) {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    )
  }

  return (
    <nav>
      <ul>
        {/* User Info Section */}
        {userName && (
          <li className="nav-user-info">
            <strong>Welcome, {userName}</strong>
            <br />
            <small className="text-muted">
              Role: <span className="badge bg-secondary">{userRole}</span>
            </small>
          </li>
        )}

        {/* Patient Links - Only show if user is a patient */}
        {userRole === PATIENT && (
          <>
            <h6 className="mt-3">Patient Menu</h6>
            <li>
              <Link to="/p/dashboard">
                {/* <i className="fa-solid fa-gauge me-2"></i> */}
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/p/my-profile">
                {/* <i className="fa-solid fa-user me-2"></i> */}
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/p/make-appointment">
                {/* <i className="fa-solid fa-calendar-plus me-2"></i> */}
                Make Appointment
              </Link>
            </li>
          </>
        )}

        {/* Staff Links - Only show if user is staff */}
        {userRole === STAFF && (
          <>
            <h6 className="mt-3">Staff Menu</h6>
            <li>
              <Link to="/s/dashboard">
                {/* <i className="fa-solid fa-gauge me-2"></i> */}
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/s/patient/profile">
                {/* <i className="fa-solid fa-user-injured me-2"></i> */}
                View Patient Profile
              </Link>
            </li>
            <li>
              <Link to="/s/patient/register">
                {/* <i className="fa-solid fa-user-plus me-2"></i> */}
                Register Patient
              </Link>
            </li>
          </>
        )}

        {/* Logout Button - Show for all logged-in users */}
        <li className="mt-3">
          <button onClick={handleLogout} className="btn btn-danger w-100">
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
