import { useState, useEffect, useRef } from 'react'
import { auth } from '@/libs/firebase'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import SelectReasonVisit from '@/components/WalkinRegistration/SelectReasonVisit'
import FillupVisit from '@/components/WalkinRegistration/FillupVisit'
import Finished from '@/components/WalkinRegistration/Finished'
import Alert from '@/components/Alert'
import {
  getInitialWalkinFormData,
  getInitialWalkinStep,
  validateWalkinNewBiteForm,
  validateWalkinFollowUpForm,
  getWalkinFormErrors
} from '@/utils/walkin-registration'
import { registerWalkinPatient } from '@/services/staffService'
import { checkEmailExists } from '@/services/authService'
import './StaffRegisterPatient.css'

const WALKIN_REGISTRATION_STEPS = [
  { label: 'Select Reason for Visit' },
  { label: 'Fill Up Form' },
  { label: 'Finished' }
]

function StaffRegisterPatient() {
  const [step, setStep] = useState(getInitialWalkinStep())
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedAppointmentId, setGeneratedAppointmentId] = useState('')

  const [selectedPatientUID, setSelectedPatientUID] = useState(null)
  const [hasPatientRecord, setHasPatientRecord] = useState(true)
  const [emailFieldError, setEmailFieldError] = useState('')
  const emailInputRef = useRef(null)

  const { navigate } = useRoleNavigation()
  const isInitialMount = useRef(true)

  const [formData, setFormData] = useState(getInitialWalkinFormData())
  const { AlertComponent, showAlert } = Alert()

  // save form data to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (step !== 3) {
      localStorage.setItem(
        'registerWalkinPatientFormData',
        JSON.stringify(formData)
      )
      localStorage.setItem('registerWalkinPatientStep', step.toString())
    }
  }, [formData, step])

  // before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step < 3 && hasFormData()) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [step, formData])

  const hasFormData = () => {
    return Object.keys(formData).some((key) => {
      const value = formData[key]
      if (typeof value === 'boolean') return value
      return value && value.toString().trim() !== ''
    })
  }

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // clear email error when email changes
    if (name === 'emailAddress' && emailFieldError) {
      setEmailFieldError('')
    }
  }

  const handleBlur = async (e) => {
    const { name, value } = e.target
    if (name === 'emailAddress') {
      await validateEmail(value)
    }
  }

  const validateEmail = async (email) => {
    if (email.trim() === '') {
      return
    }

    const result = await checkEmailExists(email)
    if (result.exists) {
      setEmailFieldError('This email is already registered')
    } else {
      setEmailFieldError('')
    }
  }

  const handlePatientSelect = (uid) => {
    setSelectedPatientUID(uid)
    if (uid) {
      setHasPatientRecord(true)
    }
  }

  const handleHasPatientRecordChange = (hasRecord) => {
    setHasPatientRecord(hasRecord)
    if (hasRecord) {
      // clear form fields when switching to existing patient
      const clearedFields = {
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
      setFormData({ ...formData, ...clearedFields })
      setEmailFieldError('')
    }
  }

  function nextStep() {
    setStep(step + 1)
  }

  function prevStep() {
    setShowErrors(false)
    showAlert('', '')
    setStep(step - 1)
  }

  const handleStep1Next = () => {
    if (!formData.appointmentReason) {
      showAlert('Please select a reason for your visit.', 'danger', {
        persist: true
      })
      return
    }

    setShowErrors(false)
    showAlert('', '')
    nextStep()
  }

  const handleStep2Submit = async () => {
    // get current staff user
    const staffUser = auth.currentUser
    if (!staffUser) {
      showAlert(
        'You must be logged in to register a walk-in patient.',
        'danger',
        {
          persist: true
        }
      )
      return
    }

    const staffUID = staffUser.uid
    let isValid = false

    // validate form based on appointment reason
    if (formData.appointmentReason === 'newBite') {
      isValid = await validateWalkinNewBiteForm(
        formData,
        hasPatientRecord,
        selectedPatientUID
      )
    } else if (formData.appointmentReason === 'followUp') {
      isValid = await validateWalkinFollowUpForm(
        formData,
        hasPatientRecord,
        selectedPatientUID
      )
    }

    if (!isValid) {
      setShowErrors(true)
      showAlert(
        'Please fill in all required fields correctly before submitting.',
        'danger',
        { persist: true }
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // validate email if new patient
    if (!hasPatientRecord && !selectedPatientUID && formData.emailAddress) {
      const emailResult = await checkEmailExists(formData.emailAddress)
      if (emailResult.exists) {
        setEmailFieldError('This email is already registered.')
        setShowErrors(true)
        showAlert(
          'Please fix all validation errors before submitting.',
          'danger',
          {
            persist: true
          }
        )

        setTimeout(() => {
          if (emailInputRef.current) {
            emailInputRef.current.focus()
            emailInputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }, 100)
        return
      }
    }

    setShowErrors(false)
    showAlert('', '')
    setIsSubmitting(true)

    try {
      const result = await registerWalkinPatient(
        formData,
        staffUID,
        hasPatientRecord,
        selectedPatientUID
      )

      if (result.success) {
        console.log('Walk-in patient registered successfully:', result)

        setGeneratedAppointmentId(result.appointmentId)

        localStorage.removeItem('registerWalkinPatientFormData')
        localStorage.removeItem('registerWalkinPatientStep')

        nextStep()
      } else {
        showAlert(
          result.error.message ||
            'Something went wrong on our end. Please try again later.',
          'danger',
          { persist: true }
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Submission error:', error)
      showAlert(
        'Something went wrong on our end. Please try again later.',
        'danger',
        { persist: true }
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirect = () => {
    localStorage.removeItem('registerWalkinPatientFormData')
    localStorage.removeItem('registerWalkinPatientStep')
    navigate('/dashboard')
  }

  const getFieldErrors = async () => {
    if (!showErrors) return {}

    return await getWalkinFormErrors(
      formData,
      hasPatientRecord,
      selectedPatientUID,
      formData.appointmentReason,
      emailFieldError,
      showErrors
    )
  }

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (showErrors) {
      getFieldErrors().then((errs) => setErrors(errs))
    } else {
      setErrors({})
    }
  }, [
    showErrors,
    formData,
    hasPatientRecord,
    selectedPatientUID,
    emailFieldError
  ])

  return (
    <>
      <div className="appointment-parent-container container py-5 d-flex align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-lg-12">
            {step === 1 && (
              <SelectReasonVisit
                formData={formData}
                handleChange={handleChange}
                onNext={handleStep1Next}
                steps={WALKIN_REGISTRATION_STEPS}
                currentStep={step}
                AlertComponent={AlertComponent}
                showAlert={showAlert}
              />
            )}

            {step === 2 && (
              <FillupVisit
                formData={formData}
                handleChange={handleChange}
                onNext={handleStep2Submit}
                onPrev={prevStep}
                errors={errors}
                isSubmitting={isSubmitting}
                steps={WALKIN_REGISTRATION_STEPS}
                currentStep={step}
                AlertComponent={AlertComponent}
                selectedPatientUID={selectedPatientUID}
                hasPatientRecord={hasPatientRecord}
                onPatientSelect={handlePatientSelect}
                onHasPatientRecordChange={handleHasPatientRecordChange}
                emailFieldError={emailFieldError}
                emailInputRef={emailInputRef}
                handleBlur={handleBlur}
                showErrors={showErrors}
              />
            )}

            {step === 3 && (
              <Finished
                formData={formData}
                appointmentId={generatedAppointmentId}
                handleRedirect={handleRedirect}
                steps={WALKIN_REGISTRATION_STEPS}
                currentStep={step}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StaffRegisterPatient
