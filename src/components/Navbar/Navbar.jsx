import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import NavBrand from '@/components/NavBrand'
import { logout } from '@/services/authService'

function Navbar() {
  const navigate = useNavigate()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await logout()
      if (!result.success) {
        console.error('Logout failed:', result.error?.message)
      }
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="navbar d-flex justify-content-between align-items-center">
      <div className="nav-container container">
        <div className="navbar-left d-flex align-items-center">
          <NavBrand />
        </div>

        <div className="navbar-right">
          <button
            className="btn btn-primary custom-logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
