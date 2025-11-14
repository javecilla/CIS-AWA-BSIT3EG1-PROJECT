import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'

import './Login.css'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import Alert from '@/components/Alert'
import loginImage from '@/assets/images/login-image.png'
import LogoBrand from '@/components/LogoBrand'

import {
  loginWithEmailPassword,
  logout,
  sendEmailVerification,
  reloadUser,
  onAuthStateChange,
  getUserData,
  isAuthError,
  getAuthErrorMessage
} from '@/services/authService'

import { validateLoginForm } from '@/utils/form-validation'
import { formatTime } from '@/utils/formatter'
import {
  checkLoginLockout,
  setLoginLockout,
  clearLoginLockout,
  incrementFailedAttempts,
  getFailedAttempts,
  checkVerificationCooldown,
  setVerificationCooldown,
  clearVerificationCooldown,
  LOCKOUT_CONFIG
} from '@/utils/user-login'

import {
  LOGIN_ERRORS,
  VERIFICATION_MESSAGES,
  RATE_LIMIT_ERROR_CODE
} from '@/constants/error-messages'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)

  const [authIsLoading, setAuthIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginStep, setLoginStep] = useState('login') // 'login' or 'verify'

  const [currentUser, setCurrentUser] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [countdown, setCountdown] = useState(0)

  const [isLocked, setIsLocked] = useState(false)
  const [lockoutCountdown, setLockoutCountdown] = useState(0)
  const [failedAttempts, setFailedAttempts] = useState(0)

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY
  const { navigate } = useRoleNavigation()
  const { AlertComponent: LoginAlertComponent, showAlert: showLoginAlert } =
    Alert()
  const { AlertComponent: VerifyAlertComponent, showAlert: showVerifyAlert } =
    Alert()

  // lockout state
  useEffect(() => {
    const lockout = checkLoginLockout()
    const attempts = getFailedAttempts()

    setFailedAttempts(attempts)

    if (lockout.isLocked) {
      setIsLocked(true)
      setLockoutCountdown(lockout.remainingSeconds)
      const lockoutMessage = `${LOGIN_ERRORS.LOCKOUT_WARNING_BASE} ${formatTime(
        lockout.remainingSeconds
      )} ${LOGIN_ERRORS.LOCKOUT_WARNING_END}`
      showLoginAlert(lockoutMessage, 'danger', { persist: true })
    }
  }, [])

  // verification cooldown
  useEffect(() => {
    const cooldown = checkVerificationCooldown()
    if (cooldown.isActive) {
      setCountdown(cooldown.remainingSeconds)
    }
  }, [])

  // auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        await user.reload()
      }

      if (user && user.emailVerified) {
        setCurrentUser(user)
        const result = await getUserData(user.uid)

        if (result.success && result.data.role) {
          clearLoginLockout()
          navigate('/dashboard')
        } else {
          showLoginAlert(
            result.error?.message || VERIFICATION_MESSAGES.ROLE_NOT_FOUND,
            'danger',
            { persist: true }
          )
          await logout()
        }
      } else if (user && !user.emailVerified) {
        setCurrentUser(user)
        setLoginStep('verify')
        showVerifyAlert(
          VERIFICATION_MESSAGES.ACCOUNT_NOT_VERIFIED_SIMPLE,
          'warning',
          { persist: true }
        )
      } else {
        setCurrentUser(null)
        setLoginStep('login')
      }

      setAuthIsLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  // verification cooldown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCount = prev - 1
          if (newCount === 0) {
            clearVerificationCooldown()
          }
          return newCount
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  // lockout timer
  useEffect(() => {
    if (lockoutCountdown > 0) {
      const timer = setInterval(() => {
        setLockoutCountdown((prev) => {
          const newCount = prev - 1
          if (newCount === 0) {
            setIsLocked(false)
            setFailedAttempts(0)
            clearLoginLockout()
            // Clear the lockout alert when countdown finishes
            showLoginAlert('', '') // Clear alert
          }
          return newCount
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [lockoutCountdown, showLoginAlert])

  // update lockout alert message when countdown changes
  useEffect(() => {
    if (isLocked && lockoutCountdown > 0) {
      const lockoutMessage = `${LOGIN_ERRORS.LOCKOUT_WARNING_BASE} ${formatTime(
        lockoutCountdown
      )} ${LOGIN_ERRORS.LOCKOUT_WARNING_END}`
      showLoginAlert(lockoutMessage, 'danger', { persist: true })
    } else if (!isLocked && lockoutCountdown === 0) {
      // Clear alert when lockout is cleared
      showLoginAlert('', '')
    }
  }, [isLocked, lockoutCountdown, showLoginAlert])

  const handleFailedLogin = () => {
    const newAttempts = incrementFailedAttempts()
    setFailedAttempts(newAttempts)

    if (newAttempts >= LOCKOUT_CONFIG.MAX_ATTEMPTS) {
      setLoginLockout()
      setIsLocked(true)
      setLockoutCountdown(LOCKOUT_CONFIG.LOCKOUT_DURATION)
      showLoginAlert(
        LOGIN_ERRORS.TOO_MANY_ATTEMPTS(LOCKOUT_CONFIG.LOCKOUT_DURATION / 60),
        'danger',
        { persist: true }
      )
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setRecaptchaToken(null)
    setValidationErrors({})
    setCountdown(0)
    clearVerificationCooldown()
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (isLocked) {
      showLoginAlert(
        LOGIN_ERRORS.ACCOUNT_LOCKED(Math.ceil(lockoutCountdown / 60)),
        'danger',
        { persist: true }
      )
      return
    }

    const errors = validateLoginForm({ email, password, recaptchaToken })
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)

      // show alert for missing required fields
      const missingFields = []
      if (errors.email) missingFields.push('email')
      if (errors.password) missingFields.push('password')

      let alertMessage = 'Please fill in all required fields.'
      if (missingFields.length === 1) {
        alertMessage =
          missingFields[0] === 'email'
            ? LOGIN_ERRORS.EMAIL_REQUIRED
            : LOGIN_ERRORS.PASSWORD_REQUIRED
      } else if (missingFields.length === 2) {
        alertMessage = 'Please provide both email and password.'
      }

      showLoginAlert(alertMessage, 'danger', { persist: true })
      return
    }

    setIsSubmitting(true)

    const result = await loginWithEmailPassword(email, password)

    if (result.success) {
      clearLoginLockout()

      if (!result.emailVerified) {
        setLoginStep('verify')
        showVerifyAlert(VERIFICATION_MESSAGES.ACCOUNT_NOT_VERIFIED, 'warning', {
          persist: true
        })
        setCurrentUser(result.user)
      }
    } else {
      if (isAuthError(result.error.code)) {
        handleFailedLogin()

        const remainingAttempts =
          LOCKOUT_CONFIG.MAX_ATTEMPTS - (failedAttempts + 1)
        if (remainingAttempts > 0) {
          setValidationErrors({
            email: LOGIN_ERRORS.INVALID_CREDENTIALS(remainingAttempts)
          })
        } else {
          setValidationErrors({
            email: LOGIN_ERRORS.INVALID_CREDENTIALS(0)
          })
        }
        setPassword('')
      } else {
        showLoginAlert(getAuthErrorMessage(result.error.code), 'danger', {
          persist: true
        })
      }
    }

    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
    setRecaptchaToken(null)
    setIsSubmitting(false)
  }

  const handleBackToLogin = async () => {
    setIsSubmitting(true)
    await logout()
    setCurrentUser(null)
    resetForm()
    setLoginStep('login')
    setIsSubmitting(false)
  }

  const handleResendVerification = async () => {
    if (!currentUser) {
      showVerifyAlert(VERIFICATION_MESSAGES.SESSION_LOST, 'danger', {
        persist: true
      })
      return
    }

    setIsSubmitting(true)
    const result = await sendEmailVerification(currentUser)

    if (result.success) {
      showVerifyAlert(VERIFICATION_MESSAGES.EMAIL_SENT, 'success')
      setVerificationCooldown()
      setCountdown(60)
    } else {
      if (result.error.code === RATE_LIMIT_ERROR_CODE) {
        showVerifyAlert(VERIFICATION_MESSAGES.TOO_MANY_REQUESTS, 'danger', {
          persist: true
        })
      } else {
        showVerifyAlert(VERIFICATION_MESSAGES.FAILED_TO_SEND, 'danger', {
          persist: true
        })
      }
    }

    setIsSubmitting(false)
  }

  const handleCheckVerification = async () => {
    setIsSubmitting(true)
    if (currentUser) {
      const result = await reloadUser(currentUser)
      if (result.success && result.emailVerified) {
        window.location.reload()
      } else {
        showVerifyAlert(VERIFICATION_MESSAGES.EMAIL_NOT_VERIFIED, 'warning', {
          persist: true
        })
      }
    }
    setIsSubmitting(false)
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
            <div className="col-lg-6 mb-4 mb-lg-0 d-none d-lg-block">
              <img
                src={loginImage}
                className="left-img"
                alt="Patient Login"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="col-lg-6">
              <LogoBrand className="mb-3" />

              {/* LOGIN FORM */}
              <form
                className={`login-card my-3 ${
                  loginStep !== 'login' ? 'd-none' : ''
                }`}
                onSubmit={handleLogin}
                noValidate
              >
                <p className="text-under fw-medium">Login to your account</p>

                {/* Alert Component */}
                <LoginAlertComponent />

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
                    disabled={isLocked}
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
                    disabled={isLocked}
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback error-message d-block">
                      {validationErrors.password}
                    </div>
                  )}
                </div>

                {!isLocked && (
                  <>
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
                  </>
                )}

                <hr className="break-line mb-4" />

                <button
                  type="submit"
                  className="btn w-100 btn-login py-2 mb-2"
                  disabled={isSubmitting || isLocked}
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
                  ) : isLocked ? (
                    <>
                      <i className="fa-solid fa-lock me-2"></i>
                      Login Locked
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

              {/* VERIFICATION CARD */}
              <div
                className={`verification-card ${
                  loginStep !== 'verify' ? 'd-none' : ''
                }`}
              >
                <p className="text-under fw-medium">
                  Verify your account first
                </p>

                {/* Alert Component */}
                <VerifyAlertComponent />

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
                  onClick={handleCheckVerification}
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
