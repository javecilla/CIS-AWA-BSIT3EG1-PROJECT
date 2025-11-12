import { useState, useEffect, useRef } from 'react'
import { auth } from '@/libs/firebase'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import SelectReasonVisit from '@/components/PatientMakeAppointment/SelectReasonVisit'
import FillupVisit from '@/components/PatientMakeAppointment/FillupVisit'
import Finished from '@/components/PatientMakeAppointment/Finished'
import Alert from '@/components/Alert'
import {
  getInitialAppointmentFormData,
  getInitialAppointmentStep
} from '@/utils/make-appointment'
import { generateAppointmentId } from '@/utils/generator'
import {
  validateNewBiteForm,
  validateFollowUpForm,
  getNewBiteFormErrors,
  getFollowUpFormErrors
} from '@/utils/form-validation'
import {
  createAppointment,
  updatePersonalInformation
} from '@/services/patientService'
import './MakeAppointment.css'

function MakeAppointment() {
  const [step, setStep] = useState(getInitialAppointmentStep())
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedAppointmentId, setGeneratedAppointmentId] = useState('')

  const { navigate } = useRoleNavigation()
  const isInitialMount = useRef(true)

  const [formData, setFormData] = useState(getInitialAppointmentFormData())
  const { AlertComponent, showAlert } = Alert()

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (step !== 3) {
      localStorage.setItem(
        'patientMakeAppointmentFormData',
        JSON.stringify(formData)
      )
      localStorage.setItem('patientMakeAppointmentStep', step.toString())
    }
  }, [formData, step])

  const hasFormData = () => {
    return Object.keys(formData).some((key) => {
      const value = formData[key]
      if (typeof value === 'boolean') return value
      return value && value.toString().trim() !== ''
    })
  }

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

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
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
    // get current user
    const user = auth.currentUser
    if (!user) {
      showAlert('You must be logged in to make an appointment.', 'danger', {
        persist: true
      })
      return
    }

    const uid = user.uid
    let isValid = false

    if (formData.appointmentReason === 'newBite') {
      isValid = validateNewBiteForm(formData)
    } else if (formData.appointmentReason === 'followUp') {
      isValid = validateFollowUpForm(formData)
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

    setShowErrors(false)
    showAlert('', '')
    setIsSubmitting(true)

    const appointmentId = generateAppointmentId()

    try {
      const result = await createAppointment(uid, appointmentId, formData)

      if (result.success) {
        // update user medical history if new bite incident
        if (result.medicalHistoryUpdate) {
          await updatePersonalInformation(uid, result.medicalHistoryUpdate)
        }

        console.log('Appointment created successfully:', result.appointmentData)

        setGeneratedAppointmentId(appointmentId)

        localStorage.removeItem('patientMakeAppointmentFormData')
        localStorage.removeItem('patientMakeAppointmentStep')

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
    localStorage.removeItem('patientMakeAppointmentFormData')
    localStorage.removeItem('patientMakeAppointmentStep')
    navigate('/dashboard')
  }

  const getFieldErrors = () => {
    if (formData.appointmentReason === 'newBite') {
      return getNewBiteFormErrors(formData, showErrors)
    } else if (formData.appointmentReason === 'followUp') {
      return getFollowUpFormErrors(formData, showErrors)
    }
    return {}
  }

  const errors = getFieldErrors()

  const MAKE_APPOINTMENT_STEPS = [
    { label: 'Select Reason for Visit' },
    { label: 'Fill Up Form' },
    { label: 'Finished' }
  ]

  return (
    <div className="appointment-parent-container container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-12">
          {step === 1 && (
            <SelectReasonVisit
              formData={formData}
              handleChange={handleChange}
              onNext={handleStep1Next}
              steps={MAKE_APPOINTMENT_STEPS}
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
              steps={MAKE_APPOINTMENT_STEPS}
              currentStep={step}
              AlertComponent={AlertComponent}
            />
          )}

          {step === 3 && (
            <Finished
              formData={formData}
              appointmentId={generatedAppointmentId}
              handleRedirect={handleRedirect}
              steps={MAKE_APPOINTMENT_STEPS}
              currentStep={step}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MakeAppointment
