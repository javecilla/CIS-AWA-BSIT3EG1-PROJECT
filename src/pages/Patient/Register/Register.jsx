import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import './Register.css'

import PersonalInfo from '@/components/PatientRegister/PersonalInfo'
import ContactInfo from '@/components/PatientRegister/ContactInfo'
import Finished from '@/components/PatientRegister/Finished'
import Alert from '@/components/Alert'

import { registerPatient, checkEmailExists } from '@/services/authService'

import {
  loadFormData,
  saveFormData,
  clearFormData,
  loadCurrentStep,
  saveCurrentStep,
  hasFormData,
  buildPatientData
} from '@/utils/patient-registration'
import { generatePatientId, generatePassword } from '@/utils/generator'
import {
  validatePersonalInformation,
  validateContactInformation
} from '@/utils/form-validation'

import {
  INITIAL_FORM_DATA,
  STORAGE_KEYS,
  STEP1_DATA_FIELDS
} from '@/constants/form-fields'
import { EMAIL_REGEX } from '@/constants/regex-patterns'
import { PATIENT } from '@/constants/user-roles'
import {
  getFirebaseErrorMessage,
  EMAIL_ALREADY_IN_USE_CODE,
  INVALID_EMAIL_CODE,
  REGISTRATION_ERRORS,
  FORM_MESSAGES
} from '@/constants/error-messages'

const REGISTRATION_STEPS = [
  { label: 'Personal Information' },
  { label: 'Contact Information' },
  { label: 'Finished' }
]

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(() =>
    loadFormData(STORAGE_KEYS.FORM_DATA, INITIAL_FORM_DATA)
  )
  const [step, setStep] = useState(() =>
    loadCurrentStep(STORAGE_KEYS.CURRENT_STEP)
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const [generatedPatientId, setGeneratedPatientId] = useState('')
  const [registeredUserName, setRegisteredUserName] = useState('')

  const { AlertComponent: Step1AlertComponent, showAlert: showStep1Alert } =
    Alert()
  const { AlertComponent: Step2AlertComponent, showAlert: showStep2Alert } =
    Alert()

  const [emailFieldError, setEmailFieldError] = useState('')
  const emailInputRef = useRef(null)

  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [recaptchaError, setRecaptchaError] = useState('')
  const recaptchaRef = useRef(null)
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const isInitialMount = useRef(true)

  // save form data to localStorage on changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (step !== 3) {
      saveFormData(STORAGE_KEYS.FORM_DATA, formData)
      saveCurrentStep(STORAGE_KEYS.CURRENT_STEP, step)
    }
  }, [formData, step])

  // warn before leaving if form has data
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === 1 && hasFormData(formData, STEP1_DATA_FIELDS)) {
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

    // clear field-specific errors
    if (name === 'emailAddress') {
      if (emailFieldError) {
        setEmailFieldError('')
      }
      if (validationErrors.emailAddress) {
        const newErrors = { ...validationErrors }
        delete newErrors.emailAddress
        setValidationErrors(newErrors)
      }
    } else if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
  }

  const handleEmailBlur = async () => {
    const email = formData.emailAddress

    // only check if email has a value and is in valid format
    if (!email || email.trim() === '') {
      return
    }

    // check email format first
    if (!EMAIL_REGEX.test(email.trim())) {
      return // format validation will handle this
    }

    try {
      const result = await checkEmailExists(email.trim())
      if (result.exists) {
        setEmailFieldError(
          'This email address is already registered. Please use a different email or try logging in.'
        )

        setValidationErrors((prev) => ({
          ...prev,
          emailAddress:
            'This email address is already registered. Please use a different email or try logging in.'
        }))
      } else {
        // clear email error if it doesn't exist
        setEmailFieldError('')
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          if (newErrors.emailAddress?.includes('already registered')) {
            delete newErrors.emailAddress
          }
          return newErrors
        })
      }
    } catch (error) {
      console.error('Error checking email existence:', error)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setEmailFieldError('')
    setRecaptchaError('')
    setValidationErrors({})
    setStep(step - 1)
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
    setRecaptchaError('')

    if (validationErrors.recaptcha) {
      const newErrors = { ...validationErrors }
      delete newErrors.recaptcha
      setValidationErrors(newErrors)
    }
  }

  const handleStep1Next = () => {
    const validation = validatePersonalInformation(formData, {
      requireAll: false
    })

    if (validation.hasErrors) {
      setValidationErrors(validation.errors)
      showStep1Alert(FORM_MESSAGES.STEP1_ERROR, 'danger', { persist: true })
      return
    }

    setValidationErrors({})
    nextStep()
  }

  const handleStep2Submit = async () => {
    const validation = await validateContactInformation(formData, {
      includeConsent: true,
      recaptchaToken,
      requireRecaptcha: true,
      requireAll: false,
      checkEmailExists
    })

    if (validation.hasErrors) {
      setValidationErrors(validation.errors)
      showStep2Alert(FORM_MESSAGES.STEP2_ERROR, 'danger', { persist: true })
      if (validation.errors.recaptcha) {
        setRecaptchaError(validation.errors.recaptcha)
      }
      if (validation.errors.emailAddress) {
        setEmailFieldError(validation.errors.emailAddress)
      }
      return
    }

    setValidationErrors({})
    setEmailFieldError('')
    await handleFirebaseRegistration()
  }

  const handleFirebaseRegistration = async () => {
    setIsSubmitting(true)
    setEmailFieldError('')

    try {
      const password = generatePassword(formData.lastName, formData.dateOfBirth)
      if (!password) {
        showStep2Alert(REGISTRATION_ERRORS.PASSWORD_GENERATION, 'danger', {
          persist: true
        })
        setIsSubmitting(false)
        return
      }

      const patientId = generatePatientId()

      const userData = buildPatientData({
        patientId,
        formData,
        role: PATIENT,
        recaptchaToken
      })

      const result = await registerPatient({
        email: formData.emailAddress,
        password,
        userData
      })

      if (result.success) {
        setGeneratedPatientId(patientId)
        setRegisteredUserName(`${formData.firstName} ${formData.lastName}`)

        clearFormData(STORAGE_KEYS.FORM_DATA)
        clearFormData(STORAGE_KEYS.CURRENT_STEP)

        nextStep()
      } else {
        handleRegistrationError(result.error.code)
      }
    } catch (error) {
      console.error('REGISTRATION ERROR:', error)
      showStep2Alert(REGISTRATION_ERRORS.GENERAL, 'danger', { persist: true })
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
      setIsSubmitting(false)
    }
  }

  const handleRegistrationError = (errorCode) => {
    const errorMessage = getFirebaseErrorMessage(errorCode)

    if (errorCode === EMAIL_ALREADY_IN_USE_CODE) {
      setEmailFieldError(REGISTRATION_ERRORS.EMAIL_IN_USE_SHORT)

      setValidationErrors((prev) => ({
        ...prev,
        emailAddress: REGISTRATION_ERRORS.EMAIL_IN_USE_SHORT
      }))
      setTimeout(() => {
        if (emailInputRef.current) {
          emailInputRef.current.focus()
          emailInputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    } else if (errorCode === INVALID_EMAIL_CODE) {
      setEmailFieldError(REGISTRATION_ERRORS.INVALID_EMAIL_SHORT)

      setValidationErrors((prev) => ({
        ...prev,
        emailAddress: REGISTRATION_ERRORS.INVALID_EMAIL_SHORT
      }))
      setTimeout(() => {
        if (emailInputRef.current) {
          emailInputRef.current.focus()
          emailInputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    }

    showStep2Alert(errorMessage, 'danger', { persist: true })
  }

  const handleRedirect = () => {
    navigate('/auth/login')
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
              validationErrors={validationErrors}
              steps={REGISTRATION_STEPS}
              currentStep={step}
              AlertComponent={Step1AlertComponent}
            />
          )}

          {step === 2 && (
            <ContactInfo
              formData={formData}
              handleChange={handleChange}
              nextStep={handleStep2Submit}
              prevStep={prevStep}
              isSubmitting={isSubmitting}
              emailFieldError={emailFieldError}
              emailInputRef={emailInputRef}
              handleBlur={handleEmailBlur}
              recaptchaToken={recaptchaToken}
              setRecaptchaToken={handleRecaptchaChange}
              recaptchaError={recaptchaError}
              setRecaptchaError={setRecaptchaError}
              recaptchaRef={recaptchaRef}
              RECAPTCHA_SITE_KEY={RECAPTCHA_SITE_KEY}
              validationErrors={validationErrors}
              steps={REGISTRATION_STEPS}
              currentStep={step}
              AlertComponent={Step2AlertComponent}
            />
          )}

          {step === 3 && (
            <Finished
              handleRedirect={handleRedirect}
              patientId={generatedPatientId}
              userName={registeredUserName}
              steps={REGISTRATION_STEPS}
              currentStep={step}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
