import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { ref, set } from 'firebase/database'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT } from '@/constants/user-roles'
import './MockRegisterFlow.css'

function MockRegisterFlow() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [suffixName, setSuffixName] = useState('')
  const [birthday, setBirthday] = useState('') // Format: YYYY-MM-DD
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const navigate = useNavigate()

  // Auto-generate password
  useEffect(() => {
    if (lastName && birthday) {
      const parts = birthday.split('-')
      if (parts.length === 3) {
        const formattedDate = `${parts[1]}${parts[2]}${parts[0]}`
        const generatedPassword = `${lastName
          .toLowerCase()
          .replace(/ /g, '')}${formattedDate}`
        setPassword(generatedPassword)
      }
    } else {
      setPassword('')
    }
  }, [lastName, birthday])

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setMiddleName('')
    setSuffixName('')
    setBirthday('')
    setEmail('')
    setPassword('')
    setRecaptchaToken(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const validateForm = () => {
    if (!firstName || !lastName || !birthday || !email) {
      setStatusMessage(
        'First Name, Last Name, Birthday, and Email are required.'
      )
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

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setIsError(false)
    setStatusMessage('Creating your account...')

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const uid = user.uid

      // Create user data object for Realtime Database
      const newPatientData = {
        role: PATIENT, // Default role
        email: email,
        fullName: {
          firstName: firstName,
          lastName: lastName,
          middleName: middleName || '',
          suffix: suffixName || ''
        },
        birthday: birthday,
        createdAt: new Date().toISOString()
      }

      await set(ref(db, 'users/' + uid), newPatientData)

      await sendEmailVerification(user)

      // Sign the user out immediately (as default)
      await signOut(auth)

      setStatusMessage(
        "Registration Successful! We've sent a verification link to your email. Please verify your account before logging in. Further more you login your with account default password that is auto-generated format: Last Name (lowercase) + Birthday (MMDDYYYY)."
      )
      setIsSuccess(true)
      resetForm()
    } catch (error) {
      console.error('FIREBASE REGISTRATION ERROR:', error)
      setStatusMessage(`Registration Failed: ${error.message}`)
      setIsError(true)

      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterAnother = () => {
    setIsSuccess(false)
    setStatusMessage('')
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-4 p-md-5 border rounded-3 shadow-sm bg-light">
            {isSuccess ? (
              // --- SUCCESS VIEW ---
              <div className="text-center">
                <h2 className="h4 mb-3 text-success">Registration Complete!</h2>
                <p>{statusMessage}</p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/test-demo/login')}
                  >
                    Go to Login Page
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleRegisterAnother}
                  >
                    Register Another Account
                  </button>
                </div>
              </div>
            ) : (
              // --- REGISTRATION FORM VIEW ---
              <>
                <h2 className="h4 mb-4 text-center">
                  Mock Patient Registration
                </h2>
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
                <form onSubmit={handleRegister}>
                  <div className="row g-2 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="firstName" className="form-label small">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="lastName" className="form-label small">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-sm-8">
                      <label htmlFor="middleName" className="form-label small">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="middleName"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="(Optional)"
                      />
                    </div>
                    <div className="col-sm-4">
                      <label htmlFor="suffixName" className="form-label small">
                        Suffix
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="suffixName"
                        value={suffixName}
                        onChange={(e) => setSuffixName(e.target.value)}
                        placeholder="(Optional)"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="birthday" className="form-label small">
                      Birthday
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthday"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      required
                    />
                  </div>
                  <hr />
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
                  <div className="mb-3 d-none">
                    <label htmlFor="password" className="form-label small">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Auto-generated (lastname+MMDDYYYY)"
                      readOnly
                      required
                    />
                    <div className="form-text">
                      <em>
                        Your password is auto-generated from Last Name +
                        Birthday (MMDDYYYY).
                      </em>
                    </div>
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
                      {isSubmitting ? 'Registering...' : 'Register Account'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockRegisterFlow
