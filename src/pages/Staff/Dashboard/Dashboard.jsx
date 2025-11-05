import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, get, child } from 'firebase/database'
import { auth, db } from '@/libs/firebase.js'
import { STAFF } from '@/constants/user-roles'
import './Dashboard.css'

function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const formatFullName = (nameObj) => {
    if (!nameObj) return 'N/A'

    const { firstName, middleName, lastName, suffix } = nameObj
    const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
    return parts.join(' ')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      if (!user.emailVerified) {
        await signOut(auth)
        navigate('/login')
        return
      }

      try {
        const userRef = child(ref(db), `users/${user.uid}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const data = snapshot.val()

          if (data.role !== STAFF) {
            setError('Unauthorized access. You are not a staff member.')
            await signOut(auth)
            navigate('/login')
            return
          }

          setUserData({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            ...data
          })
        } else {
          setError('User profile not found in database.')
          await signOut(auth)
          navigate('/login')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="container py-5 d-flex align-items-center min-vh-100 justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi fa-solid fa-triangle-exclamation me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>
              TEST Staff Dashboard - Welcome,{' '}
              {formatFullName(userData.fullName)}!
            </h1>
          </div>

          {userData && (
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-muted">
                  Staff Account Information
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>User ID:</strong>
                    </p>
                    <p className="text-muted">{userData.uid}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Email:</strong>
                    </p>
                    <p className="text-muted">{userData.email}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Full Name:</strong>
                    </p>
                    <p className="text-muted">
                      {formatFullName(userData.fullName)}
                    </p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Birthday:</strong>
                    </p>
                    <p className="text-muted">{userData.birthday || 'N/A'}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Role:</strong>
                    </p>
                    <p className="text-muted">
                      <span className="badge bg-success">{userData.role}</span>
                    </p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Account Created:</strong>
                    </p>
                    <p className="text-muted">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>Email Verified:</strong>
                    </p>
                    <p className="text-muted">
                      {userData.emailVerified ? (
                        <span className="badge bg-success">
                          <i className="fa-solid fa-circle-check me-1"></i>
                          Verified
                        </span>
                      ) : (
                        <span className="badge bg-warning">
                          <i className="fa-solid fa-circle-exclamation me-1"></i>
                          Not Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="alert alert-info" role="alert">
              <h5 className="alert-heading">
                <i className="fa-solid fa-info-circle me-2"></i>
                Staff Portal
              </h5>
              <p className="mb-0">
                Welcome to the staff dashboard. Here you can manage patients,
                appointments, and clinic operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
