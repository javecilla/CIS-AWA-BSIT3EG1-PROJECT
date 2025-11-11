import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
import { ref, get, update, set } from 'firebase/database'
import { auth, db } from '@/libs/firebase.js'
import './RegisterPatient.css'
import SelectReason from '@/components/AppointmentSteps/SelectReason'
import AppointmentForm from '@/components/AppointmentSteps/AppointmentForm'
import FollowUpForm from '@/components/AppointmentSteps/FollowUpForm'
import FollowUpConfirmation from '@/components/AppointmentSteps/FollowUpConfirmation'
import AppointmentConfirmation from '@/components/AppointmentSteps/AppointmentConfirmation'
import Header from '@/components/Header'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import { useUser } from '@/contexts/UserContext'
import { PATIENT } from '@/constants/user-roles'

const getInitialFormData = () => {
  const savedFormData = localStorage.getItem('registerWalkinPatientFormData')
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

    // Patient Details Fields
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
    hasAgreed: false,

    // Incident fields
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

    // Follow-up fields
    primaryReason: '',
    newConditions: '',
    confirmPolicy: false
  }
}

const getInitialStep = () => {
  const savedStep = localStorage.getItem('registerWalkinPatientStep')
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

function RegisterPatient() {
  const [step, setStep] = useState(getInitialStep())
  const [showErrors, setShowErrors] = useState(false)
  const [validationVersion, setValidationVersion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [generatedAppointmentId, setGeneratedAppointmentId] = useState('')

  const [selectedPatientUID, setSelectedPatientUID] = useState(null)
  const [hasPatientRecord, setHasPatientRecord] = useState(true)
  const [emailFieldError, setEmailFieldError] = useState('')
  const emailInputRef = useRef(null)

  // const navigate = useNavigate()
  const { navigate } = useRoleNavigation()
  const { role } = useUser() // Get current role to monitor changes
  const isInitialMount = useRef(true)
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false)

  // Monitor role changes to prevent null role navigation issues
  useEffect(() => {
    if (role === null && !isProcessingSubmit && step > 1) {
      // If role becomes null during the process and we're not actively submitting,
      // it might be due to auth state changes during patient creation
      console.warn(
        'Role became null during registration process, preserving current state'
      )
    }

    // If role was null and is now restored to staff, log the restoration
    if (role === 'staff' && isProcessingSubmit) {
      console.log('Staff role restored after patient creation')
    }
  }, [role, isProcessingSubmit, step])

  const [formData, setFormData] = useState(getInitialFormData())

  // Recovery mechanism for incomplete submissions
  useEffect(() => {
    const submitting = localStorage.getItem('registerWalkinPatientSubmitting')
    const savedAppointmentId = localStorage.getItem(
      'registerWalkinPatientAppointmentId'
    )

    if (submitting === 'true' && savedAppointmentId) {
      // Previous submission was interrupted
      console.log(
        'Detected incomplete submission, appointment ID:',
        savedAppointmentId
      )

      // Check if we have form data to recover
      const savedFormData = localStorage.getItem(
        'registerWalkinPatientFormData'
      )
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData)
          setFormData(parsedData)
          console.log('Recovered form data from localStorage')
        } catch (e) {
          console.error('Error recovering form data:', e)
        }
      }

      // Reset submission state
      localStorage.setItem('registerWalkinPatientSubmitting', 'false')

      // Show notification to user
      setGeneralError(
        'Previous submission was interrupted. Please review your data and try submitting again.'
      )
      setShowErrors(true)
    }
  }, [])

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

  const hasFormData = () => {
    return Object.keys(formData).some((key) => {
      const value = formData[key]
      if (typeof value === 'boolean') return value
      return value && value.toString().trim() !== ''
    })
  }

  useEffect(() => {
    if (emailFieldError) {
      setEmailFieldError('')
    }
  }, [formData.emailAddress])

  const handleBlur = (e) => {
    const { name, value } = e.target
    if (name === 'emailAddress') {
      validateEmail(value)
    }
  }

  const validateEmail = async (email) => {
    if (email.trim() === '') {
      return
    }

    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      setEmailFieldError('This email is already registered')
    } else {
      setEmailFieldError('')
    }
  }

  const handlePatientSelect = (uid) => {
    setSelectedPatientUID(uid)
    // If patient selected, they have a record
    if (uid) {
      setHasPatientRecord(true)
    }
  }

  const handleHasPatientRecordChange = (hasRecord) => {
    setHasPatientRecord(hasRecord)
    if (hasRecord) {
      // If they have a record, clear form fields
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

    // Trigger validation update for fields that should validate in real-time when showErrors is true
    if (
      showErrors &&
      (name === 'mobileNumber' ||
        name === 'emergencyContactNumber' ||
        name === 'emailAddress')
    ) {
      // Force validation recalculation by incrementing validation version
      setValidationVersion((prev) => prev + 1)
    }
  }

  function nextStep() {
    setStep((prevStep) => {
      const newStep = prevStep + 1
      // If we're moving to step 3 (confirmation), ensure we don't lose our place
      // due to any potential role navigation issues
      if (newStep === 3) {
        console.log('Moving to confirmation step 3')
      }
      return newStep
    })
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

  const generatePassword = (lastName, dateOfBirth) => {
    const parts = dateOfBirth.split('-')
    if (parts.length === 3) {
      const formattedDate = `${parts[1]}${parts[2]}${parts[0]}`
      return `${lastName.toLowerCase().replace(/ /g, '')}${formattedDate}`
    }
    return ''
  }

  const createPatientRecord = async (patientData) => {
    try {
      // Save current staff user session
      const staffUser = auth.currentUser
      if (!staffUser) {
        throw new Error('No staff user is currently logged in')
      }

      const patientId = generateAppointmentId().replace('APT-', 'P-')

      // Generate a unique ID for the patient record (without creating auth user)
      // Using Firebase-compatible format but with walkin_ prefix to distinguish from authenticated users
      // This creates a walk-in patient record under /users/{uid} without Firebase Authentication
      const patientUID = `walkin_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`

      // Create patient data structure (walk-in patient without authentication)
      const newPatientData = {
        role: PATIENT,
        patientId: patientId,
        email: patientData.emailAddress,
        fullName: {
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          middleName: patientData.middleName || '',
          suffix: patientData.suffix || ''
        },
        dateOfBirth: patientData.dateOfBirth,
        sex: patientData.sex,
        address: {
          houseNoStreet: patientData.houseNoStreet,
          barangay: patientData.barangay,
          cityMunicipality: patientData.cityMunicipality,
          province: patientData.province,
          zipCode: patientData.zipCode || ''
        },
        contactInfo: {
          mobileNumber: patientData.mobileNumber,
          emailAddress: patientData.emailAddress
        },
        emergencyContact: {
          name: patientData.emergencyContactName,
          relationship: patientData.emergencyContactRelationship,
          mobileNumber: patientData.emergencyContactNumber
        },
        consents: {
          hasReviewedInfo: patientData.hasReviewed,
          hasDataPrivacyConsent: patientData.hasConsent,
          hasNotificationConsent: patientData.hasAgreed
        },
        createdAt: new Date().toISOString(),
        createdBy: staffUser.uid,
        accountType: 'walkin',
        hasAuthAccount: false // Flag to indicate this is a walk-in record without auth
      }

      // Store patient data in Firebase Realtime Database under /users/{uid}
      await set(ref(db, `users/${patientUID}`), newPatientData)

      console.log('Walk-in patient record created successfully:', patientUID)

      // Return data without generated password since no auth account was created
      return { patientUID, patientId, generatedPassword: null }
    } catch (error) {
      console.error('Walk-in patient record creation error:', error)
      throw error
    }
  }

  const handleStep2Submit = async () => {
    setIsProcessingSubmit(true)
    let isValid = false

    // Validate form fields first before any processing
    if (formData.appointmentReason === 'newBite') {
      isValid = validateNewBiteForm()
    } else if (formData.appointmentReason === 'followUp') {
      isValid = validateFollowUpForm()
    }

    if (!isValid) {
      setIsProcessingSubmit(false)
      setShowErrors(true)
      setGeneralError(
        'Please fill in all required fields correctly before submitting.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!hasPatientRecord && !selectedPatientUID && formData.emailAddress) {
      const emailExists = await checkEmailExists(formData.emailAddress)
      if (emailExists) {
        setIsProcessingSubmit(false)
        setEmailFieldError('This email is already registered.')
        setShowErrors(true)
        setGeneralError('Please fix all validation errors before submitting.')

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

    //get current user (staff) and store role explicitly
    const staffUser = auth.currentUser
    if (!staffUser) {
      setIsProcessingSubmit(false)
      setGeneralError('You must be logged in to make an appointment.')
      return
    }

    // Store staff role explicitly to prevent null role issues during patient creation
    const staffUID = staffUser.uid
    const staffRole = 'staff' // Explicitly store staff role to prevent null issues
    const appointmentId = generateAppointmentId()

    //base appointment data (common for both types)
    const appointmentData = {
      appointmentId: appointmentId,
      staffId: staffUID,
      branch: formData.branch,
      appointmentDate: formData.appointmentDate,
      timeSlot: formData.timeSlot,
      status: 'In-Consultation', // Pending, Confirmed, In-Consultation, Completed, Cancelled
      createdAt: new Date().toISOString(),
      registrationMethod: 'walkin'
    }

    //medical history update (only for new bite)
    let medicalHistoryUpdate = null
    let patientUID = selectedPatientUID
    let patientAccountData = null

    // SCENARIO 1: New patient registration (walk-in without auth account)
    if (!hasPatientRecord && !selectedPatientUID) {
      try {
        // Create patient record first (without authentication account)
        const accountResult = await createPatientRecord(formData)
        patientUID = accountResult.patientUID
        patientAccountData = {
          patientId: accountResult.patientId,
          generatedPassword: accountResult.generatedPassword, // This will be null for walk-in patients
          email: formData.emailAddress
        }

        console.log('New walk-in patient record created:', patientUID)
      } catch (error) {
        console.error('Failed to create walk-in patient record:', error)

        // Keep showErrors true to show field validation errors
        setShowErrors(true)
        setGeneralError(
          'Failed to create walk-in patient record. Please try again.'
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    // SCENARIO 2: Existing patient - use selected patient UID
    if (hasPatientRecord && selectedPatientUID) {
      patientUID = selectedPatientUID
    }

    if (!patientUID) {
      setGeneralError('Patient selection or creation failed. Please try again.')
      return
    }

    // Update appointment data with patient information
    appointmentData.patientId = patientUID
    if (patientAccountData) {
      appointmentData.patientAccountData = patientAccountData
    }

    if (formData.appointmentReason === 'newBite') {
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
      //add follow-up specific details
      appointmentData.type = 'FollowUp'
      appointmentData.visitDetails = {
        primaryReason: formData.primaryReason,
        newConditions: formData.newConditions,
        confirmPolicy: formData.confirmPolicy
      }
    }

    setShowErrors(false)
    setGeneralError('')
    setIsSubmitting(true)

    try {
      // Enhanced localStorage persistence - save before submission
      localStorage.setItem(
        'registerWalkinPatientFormData',
        JSON.stringify(formData)
      )
      localStorage.setItem('registerWalkinPatientStep', step.toString())
      localStorage.setItem('registerWalkinPatientSubmitting', 'true')
      localStorage.setItem('registerWalkinPatientAppointmentId', appointmentId)

      //create appointment record under patient's UID
      const appointmentRef = ref(
        db,
        `appointments/${patientUID}/${appointmentId}`
      )
      await update(appointmentRef, appointmentData)

      //update user medical history if new bite incident
      if (medicalHistoryUpdate) {
        const userMedicalHistoryRef = ref(
          db,
          `users/${patientUID}/medicalHistory`
        )
        await update(userMedicalHistoryRef, medicalHistoryUpdate)
      }

      console.log('Appointment created successfully:', appointmentData)

      setGeneratedAppointmentId(appointmentId)

      // Clear localStorage only after successful submission
      localStorage.removeItem('registerWalkinPatientFormData')
      localStorage.removeItem('registerWalkinPatientStep')
      localStorage.removeItem('registerWalkinPatientSubmitting')
      localStorage.removeItem('registerWalkinPatientAppointmentId')

      nextStep()
    } catch (error) {
      console.error('Submission error:', error)

      // Keep data in localStorage on error for recovery
      localStorage.setItem('registerWalkinPatientSubmitting', 'false')

      setGeneralError(
        'Something went wrong on our end. Please try again later.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
      setIsProcessingSubmit(false) // Clear processing flag
    }
  }

  const handleRedirect = () => {
    localStorage.removeItem('registerWalkinPatientFormData')
    localStorage.removeItem('registerWalkinPatientStep')
    navigate('/dashboard')
  }

  const getFieldErrors = () => {
    if (!showErrors) return {}

    const errors = {}
    const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/
    const phoneRegex = /^(09|\+639)\d{9}$/
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const zipRegex = /^[0-9]{4}$/

    if (hasPatientRecord && !selectedPatientUID) {
      errors.patientSearch =
        'Please select a patient from the list or uncheck the box to add a new patient.'
    }

    // Patient form validation errors (if no patient selected)
    if (!hasPatientRecord && !selectedPatientUID) {
      // First Name
      if (!formData.firstName) {
        errors.firstName = 'First name is required.'
      } else if (!nameRegex.test(formData.firstName)) {
        errors.firstName =
          'Name must not contain numbers or special characters.'
      }

      // Last Name
      if (!formData.lastName) {
        errors.lastName = 'Last name is required.'
      } else if (!nameRegex.test(formData.lastName)) {
        errors.lastName = 'Name must not contain numbers or special characters.'
      }

      // Middle Name (optional)
      if (formData.middleName && !nameRegex.test(formData.middleName)) {
        errors.middleName =
          'Middle name must not contain numbers or special characters.'
      }

      // Suffix (optional)
      if (formData.suffix && !nameRegex.test(formData.suffix)) {
        errors.suffix = 'Suffix must not contain numbers or special characters.'
      }

      // Date of Birth
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required.'
      } else {
        const birthDate = new Date(formData.dateOfBirth)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (birthDate > today) {
          errors.dateOfBirth = 'Date of birth cannot be in the future.'
        }
      }

      // Sex
      if (!formData.sex || formData.sex === 'Select') {
        errors.sex = 'Sex is required.'
      }

      // House No & Street
      if (!formData.houseNoStreet) {
        errors.houseNoStreet = 'House No. & Street is required.'
      }

      // Barangay
      if (!formData.barangay) {
        errors.barangay = 'Barangay is required.'
      }

      // City/Municipality
      if (!formData.cityMunicipality) {
        errors.cityMunicipality = 'City/Municipality is required.'
      } else if (!nameRegex.test(formData.cityMunicipality)) {
        errors.cityMunicipality = 'City/Municipality must not contain numbers.'
      }

      // Province
      if (!formData.province) {
        errors.province = 'Province is required.'
      } else if (!nameRegex.test(formData.province)) {
        errors.province = 'Province must not contain numbers.'
      }

      // Zip Code (optional but must be valid)
      if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
        errors.zipCode = 'Zip code must be exactly 4 digits.'
      }

      // Mobile Number
      if (!formData.mobileNumber) {
        errors.mobileNumber = 'Mobile number is required.'
      } else if (!phoneRegex.test(formData.mobileNumber)) {
        errors.mobileNumber =
          'Invalid PH mobile number format. Must start with 09 or +639.'
      }

      // Email
      if (!formData.emailAddress) {
        errors.emailAddress = 'Email address is required.'
      } else if (!emailRegex.test(formData.emailAddress)) {
        errors.emailAddress = 'Invalid email format.'
      }
      if (emailFieldError) {
        errors.emailAddress = emailFieldError
      }

      // Emergency Contact Name
      if (!formData.emergencyContactName) {
        errors.emergencyContactName = 'Emergency contact name is required.'
      } else if (!nameRegex.test(formData.emergencyContactName)) {
        errors.emergencyContactName =
          'Name must not contain numbers or special characters.'
      }

      // Emergency Contact Relationship
      if (!formData.emergencyContactRelationship) {
        errors.emergencyContactRelationship = 'Relationship is required.'
      } else if (!nameRegex.test(formData.emergencyContactRelationship)) {
        errors.emergencyContactRelationship =
          'Relationship must not contain numbers.'
      }

      // Emergency Contact Number
      if (!formData.emergencyContactNumber) {
        errors.emergencyContactNumber =
          'Emergency contact mobile number is required.'
      } else if (!phoneRegex.test(formData.emergencyContactNumber)) {
        errors.emergencyContactNumber =
          'Invalid PH mobile number format. Must start with 09 or +639.'
      }

      // Consents
      if (!formData.hasReviewed) {
        errors.hasReviewed = 'You must review the information.'
      }
      if (!formData.hasConsent) {
        errors.hasConsent = 'You must consent to data processing.'
      }
      if (!formData.hasAgreed) {
        errors.hasAgreed = 'You must agree to receive notifications.'
      }
    }

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

  const checkEmailExists = async (email) => {
    try {
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)

      if (snapshot.exists()) {
        const users = snapshot.val()
        return Object.values(users).some((user) => user.email === email)
      }
      return false
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

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
                selectedPatientUID={selectedPatientUID}
                hasPatientRecord={hasPatientRecord}
                onPatientSelect={handlePatientSelect}
                onHasPatientRecordChange={handleHasPatientRecordChange}
                emailFieldError={emailFieldError}
                emailInputRef={emailInputRef}
                handleBlur={handleBlur}
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
                selectedPatientUID={selectedPatientUID}
                hasPatientRecord={hasPatientRecord}
                onPatientSelect={handlePatientSelect}
                onHasPatientRecordChange={handleHasPatientRecordChange}
                emailFieldError={emailFieldError}
                emailInputRef={emailInputRef}
                handleBlur={handleBlur}
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

export default RegisterPatient
