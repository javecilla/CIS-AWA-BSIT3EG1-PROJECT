import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import { useState, useEffect, useRef } from 'react'
import PersonalInfo from '@/components/Steps/PersonalInfo'
import ContactInfo from '@/components/Steps/ContactInfo'
import Finished from '@/components/Steps/Finished'
import { ref, set } from 'firebase/database'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT } from '@/constants/user-roles'

const getInitialFormData = () => {
  const savedFormData = localStorage.getItem('patientRegistrationFormData')

  if (savedFormData) {
    try {
      return JSON.parse(savedFormData)
    } catch (e) {
      console.error('Error parsing saved form data:', e)
    }
  }

  return {
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    dateOfBirth: '',
    sex: '',
    houseNoStreet: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    zipCode: '',
    mobileNumber: '',
    emailAddress: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    hasReviewed: false,
    hasConsent: false,
    hasAgreed: false
  }
}

const getInitialStep = () => {
  const savedStep = localStorage.getItem('patientRegistrationStep')
  return savedStep ? parseInt(savedStep) : 1
}

function Register() {
  const [step, setStep] = useState(getInitialStep())
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [generatedPatientId, setGeneratedPatientId] = useState('')
  const [registeredUserName, setRegisteredUserName] = useState('')

  const [emailFieldError, setEmailFieldError] = useState('')
  const emailInputRef = useRef(null)

  // reCAPTCHA state and ref
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [recaptchaError, setRecaptchaError] = useState('')
  const recaptchaRef = useRef(null)
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const isInitialMount = useRef(true)
  const navigate = useNavigate()
  const [formData, setFormData] = useState(getInitialFormData())

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (step !== 3) {
      localStorage.setItem(
        'patientRegistrationFormData',
        JSON.stringify(formData)
      )
      localStorage.setItem('patientRegistrationStep', step.toString())
    }
  }, [formData, step])

  const hasStep1Data = () => {
    const step1Fields = [
      'firstName',
      'lastName',
      'middleName',
      'suffix',
      'dateOfBirth',
      'sex',
      'houseNoStreet',
      'barangay',
      'cityMunicipality',
      'province',
      'zipCode'
    ]

    return step1Fields.some((field) => {
      const value = formData[field]
      return value && value.toString().trim() !== ''
    })
  }

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === 1 && hasStep1Data()) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [step, formData])

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    if (name === 'emailAddress' && emailFieldError) {
      setEmailFieldError('')
    }
  }

  const generatePatientId = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const randomNum = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0'
    )
    return `P-${year}${month}${day}-${randomNum}`
  }

  const generatePassword = () => {
    const parts = formData.dateOfBirth.split('-')
    if (parts.length === 3) {
      const formattedDate = `${parts[1]}${parts[2]}${parts[0]}`
      return `${formData.lastName
        .toLowerCase()
        .replace(/ /g, '')}${formattedDate}`
    }
    return ''
  }

  function nextStep() {
    setStep(step + 1)
  }

  function prevStep() {
    setShowErrors(false)
    setRegistrationError('')
    setGeneralError('')
    setEmailFieldError('')
    setRecaptchaError('')
    setStep(step - 1)
  }

  const handleStep1Next = () => {
    const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/
    const zipRegex = /^[0-9]+$/
    let hasError = false

    const required = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'sex',
      'houseNoStreet',
      'barangay',
      'cityMunicipality',
      'province'
    ]

    required.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        hasError = true
      }
    })

    if (formData.firstName && !nameRegex.test(formData.firstName))
      hasError = true
    if (formData.lastName && !nameRegex.test(formData.lastName)) hasError = true
    if (formData.middleName && !nameRegex.test(formData.middleName))
      hasError = true
    if (formData.suffix && !nameRegex.test(formData.suffix)) hasError = true
    if (formData.cityMunicipality && !nameRegex.test(formData.cityMunicipality))
      hasError = true
    if (formData.province && !nameRegex.test(formData.province)) hasError = true
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) hasError = true

    if (hasError) {
      setShowErrors(true)
      setGeneralError(
        'Please fill in all required fields correctly before proceeding.'
      )
      return
    }

    setShowErrors(false)
    setGeneralError('')
    nextStep()
  }

  const handleStep2Submit = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const phoneRegex = /^(09|\+639)\d{9}$/
    const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/
    let hasError = false

    const required = [
      'mobileNumber',
      'emailAddress',
      'emergencyContactName',
      'emergencyContactRelationship',
      'emergencyContactNumber',
      'hasReviewed',
      'hasConsent',
      'hasAgreed'
    ]

    required.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        hasError = true
      }
    })

    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber))
      hasError = true
    if (formData.emailAddress && !emailRegex.test(formData.emailAddress))
      hasError = true
    if (
      formData.emergencyContactNumber &&
      !phoneRegex.test(formData.emergencyContactNumber)
    )
      hasError = true
    if (
      formData.emergencyContactName &&
      !nameRegex.test(formData.emergencyContactName)
    )
      hasError = true
    if (
      formData.emergencyContactRelationship &&
      !nameRegex.test(formData.emergencyContactRelationship)
    )
      hasError = true

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA verification.')
      hasError = true
    } else {
      setRecaptchaError('')
    }

    if (hasError) {
      setShowErrors(true)
      setGeneralError(
        'Please complete all required fields correctly before submitting.'
      )
      return
    }

    setShowErrors(false)
    setGeneralError('')
    await handleFirebaseRegistration()
  }

  const handleFirebaseRegistration = async () => {
    setIsSubmitting(true)
    setRegistrationError('')
    setEmailFieldError('')

    try {
      const generatedPassword = generatePassword()

      if (!generatedPassword) {
        setRegistrationError(
          'Failed to generate password. Please check your date of birth.'
        )
        setIsSubmitting(false)
        return
      }

      const patientId = generatePatientId()

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.emailAddress,
        generatedPassword
      )
      const user = userCredential.user
      const uid = user.uid

      const newPatientData = {
        role: PATIENT,
        patientId: patientId,
        email: formData.emailAddress,
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || '',
          suffix: formData.suffix || ''
        },
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
        address: {
          houseNoStreet: formData.houseNoStreet,
          barangay: formData.barangay,
          cityMunicipality: formData.cityMunicipality,
          province: formData.province,
          zipCode: formData.zipCode || ''
        },
        contactInfo: {
          mobileNumber: formData.mobileNumber,
          emailAddress: formData.emailAddress
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          mobileNumber: formData.emergencyContactNumber
        },
        consents: {
          hasReviewedInfo: formData.hasReviewed,
          hasDataPrivacyConsent: formData.hasConsent,
          hasNotificationConsent: formData.hasAgreed
        },
        recaptchaToken: recaptchaToken,
        createdAt: new Date().toISOString()
      }

      await set(ref(db, 'users/' + uid), newPatientData)
      await sendEmailVerification(user)
      await signOut(auth)

      setGeneratedPatientId(patientId)
      setRegisteredUserName(`${formData.firstName} ${formData.lastName}`)

      localStorage.removeItem('patientRegistrationFormData')
      localStorage.removeItem('patientRegistrationStep')

      nextStep()
    } catch (error) {
      console.error('FIREBASE REGISTRATION ERROR:', error)

      let errorMessage = 'Registration failed. Please try again.'

      if (error.code === 'auth/email-already-in-use') {
        errorMessage =
          'This email address is already registered. Please use a different email or try logging in.'

        setEmailFieldError('This email is already registered.')
        setShowErrors(true)

        setTimeout(() => {
          if (emailInputRef.current) {
            emailInputRef.current.focus()
            emailInputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }, 100)
      } else if (error.code === 'auth/invalid-email') {
        errorMessage =
          'The email address format is invalid. Please check and try again.'
        setEmailFieldError('Invalid email format.')
        setShowErrors(true)

        setTimeout(() => {
          if (emailInputRef.current) {
            emailInputRef.current.focus()
            emailInputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }, 100)
      } else if (error.code === 'auth/weak-password') {
        errorMessage =
          'The password does not meet security requirements. Please try again.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage =
          'Network connection error. Please check your internet connection and try again.'
      } else {
        errorMessage =
          'Something went wrong on our end. Please try again later or contact support if the issue persists.'
      }

      setRegistrationError(errorMessage)

      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirect = () => {
    navigate('/login')
  }

  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-12">
          {step === 1 && (
            <PersonalInfo
              formData={formData}
              handleChange={handleChange}
              nextStep={handleStep1Next}
              showErrors={showErrors}
              generalError={generalError}
            />
          )}

          {step === 2 && (
            <ContactInfo
              formData={formData}
              handleChange={handleChange}
              nextStep={handleStep2Submit}
              prevStep={prevStep}
              showErrors={showErrors}
              isSubmitting={isSubmitting}
              registrationError={registrationError}
              generalError={generalError}
              emailFieldError={emailFieldError}
              emailInputRef={emailInputRef}
              recaptchaToken={recaptchaToken}
              setRecaptchaToken={setRecaptchaToken}
              recaptchaError={recaptchaError}
              setRecaptchaError={setRecaptchaError}
              recaptchaRef={recaptchaRef}
              RECAPTCHA_SITE_KEY={RECAPTCHA_SITE_KEY}
            />
          )}

          {step === 3 && (
            <Finished
              handleRedirect={handleRedirect}
              patientId={generatedPatientId}
              userName={registeredUserName}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
