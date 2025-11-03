import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { ref, get, child } from 'firebase/database'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT, STAFF } from '@/constants/user-roles'
import './MockLoginFlow.css'

function MockLoginFlow() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [authIsLoading, setAuthIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null) // For Auth data
  const [userData, setUserData] = useState(null) // For Realtime DB data
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loginStep, setLoginStep] = useState('login') // 'login' | 'verify'

  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const navigate = useNavigate()

  useEffect(() => {
    setStatusMessage('Connecting to Firebase...')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // User is logged in AND verified, fetch their RTDB data
        setCurrentUser(user)
        const userRef = child(ref(db), 'users/' + user.uid)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          setUserData(snapshot.val()) // Set RTDB data
          setStatusMessage('User is logged in and verified.')
        } else {
          setUserData(null)
          setStatusMessage('User logged in, but no profile data found in DB.')
          setIsError(true)
        }
      } else if (user && !user.emailVerified) {
        // User is logged in but NOT verified
        // This is fine, we keep them on the login page (but in the 'verify' step if they just tried)
        setCurrentUser(user)
        setUserData(null)
        // Only set this if they aren't trying to log in
        if (loginStep !== 'verify') {
          setStatusMessage('Please verify your email to log in.')
        }
        setIsError(true)
      } else {
        // User is logged out
        setCurrentUser(null)
        setUserData(null)
        setStatusMessage('User is logged out.')
        setLoginStep('login') // Reset step on full logout
      }
      setAuthIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setRecaptchaToken(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const validateForm = () => {
    if (!email || !password) {
      setStatusMessage('Email and password are required.')
      setIsError(true)
      return false
    }
    if (!recaptchaToken) {
      setStatusMessage('Please check the "I\'m not a robot" box.')
      setIsError(true)
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setIsError(false)
    setStatusMessage('Attempting to log in...')

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      if (!user.emailVerified) {
        // If not verified, set error, and change view to 'verify'
        setStatusMessage(
          'Your account is not verified. Please verify it first. Click the button below to verify your account.'
        )
        setIsError(true)
        setLoginStep('verify')
        // We DON'T log them out. onAuthStateChanged will set them as currentUser.
      } else {
        // Login successful, onAuthStateChanged listener will handle data fetching
        setStatusMessage('Login successful! Fetching data...')
        resetForm()
      }
    } catch (error) {
      console.error('FIREBASE LOGIN ERROR:', error)
      setStatusMessage(`Login Failed: ${error.message}`)
      setIsError(true)
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    setIsSubmitting(true)
    await signOut(auth)
    resetForm()
    setLoginStep('login')
    setIsSubmitting(false)
  }

  const handleBackToLogin = () => {
    resetForm()
    setLoginStep('login')
    setStatusMessage('')
    setIsError(false)
  }

  const handleResendVerification = async () => {
    if (!currentUser) {
      setStatusMessage('Error: No user found. Please try logging in again.')
      setIsError(true)
      setLoginStep('login')
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Sending verification email...')
    try {
      await sendEmailVerification(currentUser)
      setStatusMessage('Verification email sent! Please check your inbox.')
      setIsError(false)
    } catch (error) {
      console.error('RESEND VERIFICATION ERROR:', error)
      setStatusMessage(`Error: ${error.message}`)
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authIsLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-4 p-md-5 border rounded-3 shadow-sm bg-light">
            {/* Show User Profile OR Login Form */}
            {currentUser && userData ? (
              // --- LOGGED IN & VERIFIED VIEW (Requirement #3) ---
              <div className="text-left">
                <h2 className="h4 mb-3 text-success">Login Successful!</h2>
                <p>Welcome back, {userData.fullName?.firstName || 'User'}!</p>

                <div className="card mb-3">
                  <div className="card-header">Authentication Data</div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>UID:</strong> {currentUser.uid}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Realtime Database Data</div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>Role:</strong> {userData.role}
                    </p>
                    <p className="mb-1">
                      <strong>Name:</strong> {userData.fullName?.firstName}{' '}
                      {userData.fullName?.lastName}
                    </p>
                    <p className="mb-0">
                      <strong>Birthday:</strong> {userData.birthday}
                    </p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">User test content</div>
                  <div className="card-body">
                    {/* {(() => {
                      const isStaff = String(userData.role || '')

                      return isStaff ? (
                        <div>
                          <h5>staff content</h5>
                          <ul>
                            <li>staff dashboard</li>
                            <li>display all patients</li>
                            <li>display patient appointments</li>
                          </ul>
                        </div>
                      ) : (
                        <div>
                          <h5>patient content</h5>
                          <ul>
                            <li>patient dashboard</li>
                            <li>display patient info</li>
                            <li>book appointment</li>
                          </ul>
                        </div>
                      )
                    })()} */}

                    {userData.role === STAFF ? (
                      <div>
                        <h5>Staff Content</h5>
                        <ul>
                          <li>Staff dashboard</li>
                          <li>Display all patients</li>
                          <li>Display patient appointments</li>
                        </ul>
                      </div>
                    ) : (
                      //userData.role === PATIENT
                      <div>
                        <h5>Patient Content</h5>
                        <ul>
                          <li>Patient dashboard</li>
                          <li>Display patient info</li>
                          <li>Book appointment</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={handleLogout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            ) : (
              // --- LOGIN / VERIFY VIEW ---
              <>
                <h2 className="h4 mb-4 text-center">Patient Login</h2>
                {statusMessage && (
                  <div
                    className={`alert ${
                      isError ? 'alert-danger' : 'alert-info'
                    }`}
                    role="alert"
                  >
                    {statusMessage}
                  </div>
                )}

                {loginStep === 'login' ? (
                  // --- DEFAULT LOGIN FORM ---
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label small">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label small">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3 d-flex justify-content-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                      />
                    </div>
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </form>
                ) : (
                  // --- ACCOUNT VERIFICATION ---
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={handleResendVerification}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Verify My Account'}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleBackToLogin}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Renamed export
export default MockLoginFlow
