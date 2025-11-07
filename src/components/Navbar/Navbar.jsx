import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/libs/firebase.js'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut(auth)
      navigate('/login')
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
          <div className="logo-container d-flex align-items-center">
            <img src="/assets/images/logo.png" alt="Main Logo" />
            <div className="text-logo d-flex flex-column">
              <h3 className="m-0">Animal Bite</h3>
              <h3 className="m-0">CENTER</h3>
            </div>
          </div>
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
