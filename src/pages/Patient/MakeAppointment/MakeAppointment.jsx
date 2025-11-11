import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, update } from 'firebase/database'
import { auth, db } from '@/libs/firebase.js'
import './MakeAppointment.css'
import SelectReason from '@/components/AppointmentSteps/SelectReason'
import AppointmentForm from '@/components/AppointmentSteps/AppointmentForm'
import FollowUpForm from '@/components/AppointmentSteps/FollowUpForm'
import FollowUpConfirmation from '@/components/AppointmentSteps/FollowUpConfirmation'
import AppointmentConfirmation from '@/components/AppointmentSteps/AppointmentConfirmation'
import Header from '@/components/Header'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'

const getInitialFormData = () => {
  const savedFormData = localStorage.getItem('patientMakeAppointmentFormData')

  if (savedFormData) {
    try {
      return JSON.parse(savedFormData)
    } catch (e) {
      console.error('Error parsing saved form data:', e)
    }
  }

  return {
    appointmentReason: '', // 'newBite' or 'followUp'

    branch: '',
    appointmentDate: '',
    timeSlot: '',

    incidentDate: '',
    exposureBite: false,
    exposureLick: false,
    exposureScratch: false,
    exposureAbrasion: false,
    exposureContamination: false,
    exposureNibble: false,
    animalType: '',
    biteLocation: '',
    animalVaccinationStatus: '',

    hasAllergies: '',
    allergies: '',
    hasReceivedVaccine: '',
    lastShotDate: '',

    primaryReason: '',
    newConditions: '',
    confirmPolicy: false
  }
}

const getInitialStep = () => {
  const savedStep = localStorage.getItem('patientMakeAppointmentStep')
  return savedStep ? parseInt(savedStep) : 1
}

//NOTE: Temporary lang
const calculateNextDose = (incidentDate, currentDate = new Date()) => {
  const incident = new Date(incidentDate)
  const daysDiff = Math.floor((currentDate - incident) / (1000 * 60 * 60 * 24))

  // Rabies vaccination schedule:
  // Day 0, Day 3, Day 7, Day 14, Day 28
  if (daysDiff === 0) return 'Dose 1 (Day 0)'
  if (daysDiff >= 1 && daysDiff < 3) return 'Dose 1 (Day 0) - Late'
  if (daysDiff >= 3 && daysDiff < 7) return 'Dose 2 (Day 3)'
  if (daysDiff >= 7 && daysDiff < 14) return 'Dose 3 (Day 7)'
  if (daysDiff >= 14 && daysDiff < 28) return 'Dose 4 (Day 14)'
  if (daysDiff >= 28) return 'Dose 5 (Day 28)'

  return 'Dose 1 (Day 0)'
}

const generateAppointmentId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `APT-${year}${month}${day}-${randomNum}`
}

function MakeAppointment() {
  const [step, setStep] = useState(getInitialStep())
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [generatedAppointmentId, setGeneratedAppointmentId] = useState('')

  // const navigate = useNavigate()
  const { navigate } = useRoleNavigation()
  const isInitialMount = useRef(true)

  const [formData, setFormData] = useState(getInitialFormData())

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
    setGeneralError('')
    setStep(step - 1)
  }

  const handleStep1Next = () => {
    if (!formData.appointmentReason) {
      setGeneralError('Please select a reason for your visit.')
      setShowErrors(true)
      return
    }

    setShowErrors(false)
    setGeneralError('')
    nextStep()
  }

  const validateNewBiteForm = () => {
    let hasError = false
    const required = [
      'branch',
      'appointmentDate',
      'timeSlot',
      'incidentDate',
      'animalType',
      'biteLocation',
      'animalVaccinationStatus',
      'hasAllergies',
      'hasReceivedVaccine'
    ]

    required.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        hasError = true
      }
    })

    const hasExposure = [
      'exposureBite',
      'exposureLick',
      'exposureScratch',
      'exposureAbrasion',
      'exposureContamination',
      'exposureNibble'
    ].some((field) => formData[field])

    if (!hasExposure) {
      hasError = true
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.appointmentDate)
    if (selectedDate < today) {
      hasError = true
    }

    const incidentDate = new Date(formData.incidentDate)
    if (incidentDate > new Date()) {
      hasError = true
    }

    if (formData.hasAllergies === 'yes' && !formData.allergies) {
      hasError = true
    }

    if (formData.hasReceivedVaccine === 'yes' && !formData.lastShotDate) {
      hasError = true
    }

    return !hasError
  }

  const validateFollowUpForm = () => {
    let hasError = false
    const required = [
      'branch',
      'appointmentDate',
      'timeSlot',
      'primaryReason',
      'newConditions'
    ]

    required.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        hasError = true
      }
    })

    if (!formData.confirmPolicy) {
      hasError = true
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.appointmentDate)
    if (selectedDate < today) {
      hasError = true
    }

    return !hasError
  }

  const handleStep2Submit = async () => {
    let isValid = false

    //get current user
    const user = auth.currentUser
    if (!user) {
      setGeneralError('You must be logged in to make an appointment.')
      return
    }

    const uid = user.uid
    const appointmentId = generateAppointmentId()

    //base appointment data (common for both types)
    const appointmentData = {
      appointmentId: appointmentId,
      userId: uid,
      branch: formData.branch,
      appointmentDate: formData.appointmentDate,
      timeSlot: formData.timeSlot,
      status: 'Pending', // Pending, Confirmed, Completed, Cancelled
      createdAt: new Date().toISOString()
    }

    //medical history update (only for new bite)
    let medicalHistoryUpdate = null

    if (formData.appointmentReason === 'newBite') {
      isValid = validateNewBiteForm()

      const nextDose = calculateNextDose(
        formData.incidentDate,
        new Date(formData.appointmentDate)
      )

      //add incident-specific details
      appointmentData.type = 'Incident'
      appointmentData.incidentDetails = {
        primaryReason: nextDose,
        incidentDate: formData.incidentDate,
        exposures: {
          bite: formData.exposureBite,
          lick: formData.exposureLick,
          scratch: formData.exposureScratch,
          abrasion: formData.exposureAbrasion,
          contamination: formData.exposureContamination,
          nibble: formData.exposureNibble
        },
        animalType: formData.animalType,
        biteLocation: formData.biteLocation,
        animalVaccinationStatus: formData.animalVaccinationStatus
      }

      //prepare medical history update for user profile
      medicalHistoryUpdate = {
        hasAllergies: formData.hasAllergies,
        allergies: formData.hasAllergies === 'yes' ? formData.allergies : '',
        hasReceivedVaccine: formData.hasReceivedVaccine,
        lastShotDate:
          formData.hasReceivedVaccine === 'yes' ? formData.lastShotDate : ''
      }
    } else if (formData.appointmentReason === 'followUp') {
      isValid = validateFollowUpForm()

      //add follow-up specific details
      appointmentData.type = 'FollowUp'
      appointmentData.visitDetails = {
        primaryReason: formData.primaryReason,
        newConditions: formData.newConditions,
        confirmPolicy: formData.confirmPolicy
      }
    }

    if (!isValid) {
      setShowErrors(true)
      setGeneralError(
        'Please fill in all required fields correctly before submitting.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setShowErrors(false)
    setGeneralError('')
    setIsSubmitting(true)

    try {
      //create appointment record
      const appointmentRef = ref(db, `appointments/${uid}/${appointmentId}`)
      await update(appointmentRef, appointmentData)

      //update user medical history if new bite incident siya
      if (medicalHistoryUpdate) {
        const userMedicalHistoryRef = ref(db, `users/${uid}/medicalHistory`)
        await update(userMedicalHistoryRef, medicalHistoryUpdate)
      }

      console.log('Appointment created successfully:', appointmentData)

      setGeneratedAppointmentId(appointmentId)

      localStorage.removeItem('patientMakeAppointmentFormData')
      localStorage.removeItem('patientMakeAppointmentStep')

      nextStep()
    } catch (error) {
      console.error('Submission error:', error)
      setGeneralError(
        'Something went wrong on our end. Please try again later.'
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
    if (!showErrors) return {}

    const errors = {}

    if (formData.appointmentReason === 'newBite') {
      // Common fields
      if (!formData.branch) errors.branch = 'Branch selection is required.'
      if (!formData.appointmentDate) {
        errors.appointmentDate = 'Appointment date is required.'
      } else {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedDate = new Date(formData.appointmentDate)
        if (selectedDate < today) {
          errors.appointmentDate = 'Appointment date cannot be in the past.'
        }
      }
      if (!formData.timeSlot) errors.timeSlot = 'Time slot is required.'

      // Incident details
      if (!formData.incidentDate) {
        errors.incidentDate = 'Date of incident is required.'
      } else {
        const incidentDate = new Date(formData.incidentDate)
        if (incidentDate > new Date()) {
          errors.incidentDate = 'Incident date cannot be in the future.'
        }
      }

      // Check exposure types
      const hasExposure = [
        'exposureBite',
        'exposureLick',
        'exposureScratch',
        'exposureAbrasion',
        'exposureContamination',
        'exposureNibble'
      ].some((field) => formData[field])

      if (!hasExposure) {
        errors.exposure = 'Please select at least one type of exposure.'
      }

      if (!formData.animalType) errors.animalType = 'Animal type is required.'
      if (!formData.biteLocation)
        errors.biteLocation = 'Bite location is required.'
      if (!formData.animalVaccinationStatus) {
        errors.animalVaccinationStatus =
          'Animal vaccination status is required.'
      }

      // Medical history
      if (!formData.hasAllergies) {
        errors.hasAllergies = 'Please indicate if you have allergies.'
      } else if (formData.hasAllergies === 'yes' && !formData.allergies) {
        errors.allergies = 'Please specify your allergies.'
      }

      if (!formData.hasReceivedVaccine) {
        errors.hasReceivedVaccine =
          'Please indicate if you have received vaccine before.'
      } else if (
        formData.hasReceivedVaccine === 'yes' &&
        !formData.lastShotDate
      ) {
        errors.lastShotDate = 'Please provide the date of your last shot.'
      }
    } else if (formData.appointmentReason === 'followUp') {
      // Common fields
      if (!formData.branch) errors.branch = 'Branch selection is required.'
      if (!formData.appointmentDate) {
        errors.appointmentDate = 'Appointment date is required.'
      } else {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedDate = new Date(formData.appointmentDate)
        if (selectedDate < today) {
          errors.appointmentDate = 'Appointment date cannot be in the past.'
        }
      }
      if (!formData.timeSlot) errors.timeSlot = 'Time slot is required.'

      // Follow-up specific
      if (!formData.primaryReason) {
        errors.primaryReason = 'Primary reason for visit is required.'
      }
      if (!formData.newConditions) {
        errors.newConditions =
          'This field is required. Enter "None" if not applicable.'
      }
      if (!formData.confirmPolicy) {
        errors.confirmPolicy =
          'You must confirm the details and agree to proceed.'
      }
    }

    return errors
  }

  const errors = getFieldErrors()

  return (
    <>
      <Header />

      <div className="appointment-parent-container container py-5 d-flex align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-lg-12">
            {step === 1 && (
              <SelectReason
                formData={formData}
                handleChange={handleChange}
                nextStep={handleStep1Next}
                generalError={generalError}
              />
            )}

            {step === 2 && formData.appointmentReason === 'newBite' && (
              <AppointmentForm
                formData={formData}
                handleChange={handleChange}
                nextStep={handleStep2Submit}
                prevStep={prevStep}
                showErrors={showErrors}
                errors={errors}
                isSubmitting={isSubmitting}
                generalError={generalError}
              />
            )}

            {step === 2 && formData.appointmentReason === 'followUp' && (
              <FollowUpForm
                formData={formData}
                handleChange={handleChange}
                nextStep={handleStep2Submit}
                prevStep={prevStep}
                showErrors={showErrors}
                errors={errors}
                isSubmitting={isSubmitting}
                generalError={generalError}
              />
            )}

            {step === 3 && formData.appointmentReason === 'newBite' && (
              <AppointmentConfirmation
                formData={formData}
                appointmentId={generatedAppointmentId}
                handleRedirect={handleRedirect}
              />
            )}

            {step === 3 && formData.appointmentReason === 'followUp' && (
              <FollowUpConfirmation
                formData={formData}
                appointmentId={generatedAppointmentId}
                handleRedirect={handleRedirect}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MakeAppointment
