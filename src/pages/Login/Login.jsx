import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { ref, get, child } from 'firebase/database'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth'

import './Login.css'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT, STAFF } from '@/constants/user-roles'
import loginImage from '@/assets/images/login-image.png'
import logoClinic from '@/assets/images/logo-clinic.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [authIsLoading, setAuthIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginStep, setLoginStep] = useState('login')

  const [generalError, setGeneralError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const [verificationMessage, setVerificationMessage] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('warning')
  const [countdown, setCountdown] = useState(0)

  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const COOLDOWN_KEY = 'verification_cooldown_expiry'

  const navigate = useNavigate()

  //check for existing resend verification email cooldown
  useEffect(() => {
    const storedExpiry = localStorage.getItem(COOLDOWN_KEY)

    if (storedExpiry) {
      const remainingTime = Math.max(
        0,
        Math.floor((parseInt(storedExpiry) - Date.now()) / 1000)
      )
      if (remainingTime > 0) {
        setCountdown(remainingTime)
      } else {
        localStorage.removeItem(COOLDOWN_KEY)
      }
    }
  }, [])

  //auth state listener - handles redirects on verified login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      //force token refresh to get latest email verification status
      if (user) {
        await user.reload()
      }

      if (user && user.emailVerified) {
        //if user is authenticated and verified
        setCurrentUser(user)
        try {
          const userRef = child(ref(db), 'users/' + user.uid)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            const userData = snapshot.val()
            if (userData.role === PATIENT) {
              navigate('/p/dashboard')
            } else if (userData.role === STAFF) {
              navigate('/s/dashboard')
            } else {
              //role not found
              setGeneralError('User role not found. Please contact support.')
              await signOut(auth)
            }
          } else {
            //no db record
            setGeneralError('User profile data not found.')
            await signOut(auth)
          }
        } catch (error) {
          setGeneralError('Failed to fetch user data.')
          await signOut(auth)
        }
      } else if (user && !user.emailVerified) {
        //if user is authentication pero di verified
        setCurrentUser(user)
        setLoginStep('verify') //show verification view
        setVerificationMessage(
          'Your account is not verified. Please verify it first.'
        )
        setVerificationStatus('warning')
      } else {
        //user is logged out
        setCurrentUser(null)
        setLoginStep('login')
      }

      setAuthIsLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  //resend verifiaction link countdown timer management
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          const newCount = prevCount - 1

          if (newCount === 0) {
            localStorage.removeItem(COOLDOWN_KEY)
          }

          return newCount
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setRecaptchaToken(null)
    setValidationErrors({})
    setGeneralError('')
    setVerificationMessage('')
    setVerificationStatus('warning')
    setCountdown(0)
    localStorage.removeItem(COOLDOWN_KEY)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!email) {
      errors.email = 'Please provide an email address.'
    }
    if (!password) {
      errors.password = 'Password is required!'
    }
    if (!recaptchaToken) {
      errors.recaptcha = 'Please check the recaptcha.'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setGeneralError('')
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      //check verification status
      if (!userCredential.user.emailVerified) {
        setLoginStep('verify')
        setVerificationMessage(
          'Your account is not verified. Please verify it first. Click the button below to verify your account.'
        )
        setVerificationStatus('warning')
        setCurrentUser(userCredential.user)
      }
    } catch (error) {
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        // setValidationErrors({
        //   general: 'Invalid email or password! please try again.'
        // })
        setValidationErrors({
          email: 'Invalid email or password! please try again.'
        })
        setPassword('')
      } else {
        setGeneralError(
          'Something went wrong on our end. Please try again later.'
        )
      }
      console.error('FIREBASE LOGIN ERROR:', error)
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
      setIsSubmitting(false)
    }
  }

  const handleBackToLogin = async () => {
    setIsSubmitting(true)
    await signOut(auth)
    setCurrentUser(null)
    resetForm()
    setLoginStep('login')
    setIsSubmitting(false)
  }

  const handleResendVerification = async () => {
    if (!currentUser) {
      setVerificationMessage('User session lost. Please go back and try again.')
      setVerificationStatus('danger')
      return
    }

    setIsSubmitting(true)
    try {
      await sendEmailVerification(currentUser)
      setVerificationMessage(
        'Verification email sent! Please check your inbox.'
      )
      setVerificationStatus('success')

      //store expiry timestamp sa localStorage
      const expiryTime = Date.now() + 60 * 1000 //60 seconds from now
      localStorage.setItem(COOLDOWN_KEY, expiryTime.toString())
      setCountdown(60)
    } catch (error) {
      setVerificationStatus('danger')
      if (error.code === 'auth/too-many-requests') {
        setVerificationMessage(
          'You have requested this too many times. Please wait a moment and try again.'
        )
      } else {
        setVerificationMessage(
          'Failed to send verification email. Please try again.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authIsLoading) {
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

  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-10">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src={loginImage}
                className="left-img"
                alt="Patient Login"
                loading="lazy"
              />
            </div>

            <div className="col-lg-6">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={logoClinic}
                  className="logo-circle me-3 logo"
                  alt="Clinic Logo"
                />
                <div>
                  <h4 className="fw-medium mb-0 logo-text">Animal Bite</h4>
                  <h4 className="fw-bold logo-text">CENTER</h4>
                </div>
              </div>

              <form
                className={`login-card my-3 ${
                  loginStep !== 'login' ? 'd-none' : ''
                }`}
                onSubmit={handleLogin}
                noValidate
              >
                <p className="text-under fw-medium">Login to your account</p>

                {/* General Error Alert */}
                {generalError && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
                    <div>{generalError}</div>
                  </div>
                )}

                {/* General Validation Error */}
                {validationErrors.general && (
                  <div className="alert alert-danger">
                    {validationErrors.general}
                  </div>
                )}

                <div>
                  <label className="fw-medium field-label">Email:</label>
                  <p className="text-muted small m-0 mb-3">
                    Enter your email associated to your account.
                  </p>
                  <input
                    type="email"
                    className={`form-control mb-1 mt-1 ${
                      validationErrors.email ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., john.doe@example.net"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationErrors.email) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          email: null
                        }))
                      }
                    }}
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback error-message d-block">
                      {validationErrors.email}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="fw-medium field-label">Password</label>
                  <input
                    type="password"
                    className={`form-control mb-1 mt-1 ${
                      validationErrors.password ? 'is-invalid' : ''
                    }`}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          password: null
                        }))
                      }
                    }}
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback error-message d-block">
                      {validationErrors.password}
                    </div>
                  )}
                </div>

                <div className="mt-4 mb-3 d-flex justify-content-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                      setRecaptchaToken(token)
                      setValidationErrors((prev) => ({
                        ...prev,
                        recaptcha: null
                      }))
                    }}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                </div>
                {validationErrors.recaptcha && (
                  <div className="error-message recaptcha">
                    {validationErrors.recaptcha}
                  </div>
                )}

                <hr className="break-line mb-4" />

                <button
                  type="submit"
                  className="btn w-100 btn-login py-2 mb-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                <p className="mt-3 text-center">
                  Don't have an account yet?&nbsp;
                  <Link className="text-primary" to="/register">
                    register here
                  </Link>
                </p>
              </form>

              {/* --- VERIFICATION CARD --- */}
              <div
                className={`verification-card ${
                  loginStep !== 'verify' ? 'd-none' : ''
                }`}
              >
                <p className="text-under fw-medium">
                  Verify your account first
                </p>

                {/* General/Status Message Area */}
                {verificationMessage && (
                  <div
                    className={`alert ${
                      verificationStatus === 'success'
                        ? 'alert-success'
                        : verificationStatus === 'warning'
                        ? 'alert-warning'
                        : 'alert-danger'
                    } d-flex align-items-center`}
                    role="alert"
                  >
                    <i
                      className={`bi flex-shrink-0 me-2 fa-solid ${
                        verificationStatus === 'success'
                          ? 'fa-circle-check'
                          : 'fa-triangle-exclamation'
                      }`}
                    ></i>
                    <div>{verificationMessage}</div>
                  </div>
                )}

                <hr />

                <button
                  type="button"
                  className="btn w-100 btn-verify py-2 mb-2"
                  onClick={handleResendVerification}
                  disabled={isSubmitting || countdown > 0}
                >
                  {isSubmitting
                    ? 'Sending...'
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : 'Verify my account'}
                </button>
                <button
                  type="button"
                  className="btn w-100 btn-secondary py-2 mb-2"
                  onClick={async () => {
                    setIsSubmitting(true)
                    if (currentUser) {
                      await currentUser.reload()
                      // Force auth state check
                      if (currentUser.emailVerified) {
                        window.location.reload()
                      } else {
                        setVerificationMessage(
                          'Email not verified yet. Please check your inbox and try again.'
                        )
                        setVerificationStatus('warning')
                      }
                    }
                    setIsSubmitting(false)
                  }}
                  disabled={isSubmitting}
                >
                  I've Verified - Continue
                </button>
                <button
                  type="button"
                  className="btn w-100 btn-back py-2 mb-2"
                  onClick={handleBackToLogin}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
