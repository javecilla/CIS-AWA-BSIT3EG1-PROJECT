import {
  validatePersonalInformation,
  validateContactInformation,
  validateNewBiteForm,
  validateFollowUpForm,
  getNewBiteFormErrors,
  getFollowUpFormErrors
} from '@/utils/form-validation'
import { APPOINTMENT_STATUS } from '@/constants/appointments'
import { calculateNextDose } from '@/utils/calculator'

export const getInitialWalkinFormData = () => {
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

export const getInitialWalkinStep = () => {
  const savedStep = localStorage.getItem('registerWalkinPatientStep')
  return savedStep ? parseInt(savedStep) : 1
}

//validate new bite incident form for walk-in registration
export const validateWalkinNewBiteForm = async (
  formData,
  hasPatientRecord,
  selectedPatientUID
) => {
  //validate patient selection if has record
  if (hasPatientRecord && !selectedPatientUID) {
    return false
  }

  //validate patient information if no record
  if (!hasPatientRecord && !selectedPatientUID) {
    const personalValidation = validatePersonalInformation(formData, {
      requireAll: false
    })
    if (personalValidation.hasErrors) {
      return false
    }

    const contactValidation = await validateContactInformation(formData, {
      includeConsent: true,
      includeEmail: true,
      requireRecaptcha: false,
      requireAll: false
    })
    if (contactValidation.hasErrors) {
      return false
    }
  }

  //reuse appointment form validation
  return validateNewBiteForm(formData)
}

//validate follow-up consultation form for walk-in registration
export const validateWalkinFollowUpForm = async (
  formData,
  hasPatientRecord,
  selectedPatientUID
) => {
  //validate patient selection if has record
  if (hasPatientRecord && !selectedPatientUID) {
    return false
  }

  //validate patient information if no record
  if (!hasPatientRecord && !selectedPatientUID) {
    const personalValidation = validatePersonalInformation(formData, {
      requireAll: false
    })
    if (personalValidation.hasErrors) {
      return false
    }

    const contactValidation = await validateContactInformation(formData, {
      includeConsent: true,
      includeEmail: true,
      requireRecaptcha: false,
      requireAll: false
    })
    if (contactValidation.hasErrors) {
      return false
    }
  }

  //reuse appointment form validation
  return validateFollowUpForm(formData)
}

//get field-specific errors for walk-in registration form
export const getWalkinFormErrors = async (
  formData,
  hasPatientRecord,
  selectedPatientUID,
  appointmentReason,
  emailFieldError = '',
  showErrors = true
) => {
  const errors = {}

  //patient selection validation (walk-in specific)
  if (hasPatientRecord && !selectedPatientUID) {
    errors.patientSearch =
      'Please select a patient from the list or uncheck the box to add a new patient.'
  }

  //patient form validation (if no patient selected) - walk-in specific
  if (!hasPatientRecord && !selectedPatientUID) {
    const personalValidation = validatePersonalInformation(formData, {
      requireAll: false
    })
    Object.assign(errors, personalValidation.errors)

    const contactValidation = await validateContactInformation(formData, {
      includeConsent: true,
      includeEmail: true,
      requireRecaptcha: false,
      requireAll: false
    })
    Object.assign(errors, contactValidation.errors)

    if (emailFieldError) {
      errors.emailAddress = emailFieldError
    }
  }

  if (appointmentReason === 'newBite') {
    const appointmentErrors = getNewBiteFormErrors(formData, showErrors)
    Object.assign(errors, appointmentErrors)
  } else if (appointmentReason === 'followUp') {
    const appointmentErrors = getFollowUpFormErrors(formData, showErrors)
    Object.assign(errors, appointmentErrors)
  }

  return errors
}

export const buildWalkinPatientData = (formData, patientId, staffUID) => {
  return {
    role: 'patient',
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
    createdAt: new Date().toISOString(),
    createdBy: staffUID,
    accountType: 'walkin',
    hasAuthAccount: false
  }
}

//build appointment data object for walk-in registration
export const buildWalkinAppointmentData = (
  formData,
  appointmentId,
  staffUID,
  patientUID,
  appointmentReason
) => {
  const appointmentData = {
    appointmentId: appointmentId,
    staffId: staffUID,
    branch: formData.branch,
    appointmentDate: formData.appointmentDate,
    timeSlot: formData.timeSlot,
    status: APPOINTMENT_STATUS.IN_CONSULTATION,
    createdAt: new Date().toISOString(),
    registrationMethod: 'walkin'
  }

  if (appointmentReason === 'newBite') {
    const nextDose = calculateNextDose(
      formData.incidentDate,
      new Date(formData.appointmentDate)
    )

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
  } else if (appointmentReason === 'followUp') {
    appointmentData.type = 'FollowUp'
    appointmentData.visitDetails = {
      primaryReason: formData.primaryReason,
      newConditions: formData.newConditions,
      confirmPolicy: formData.confirmPolicy
    }
  }

  return appointmentData
}

//build medical history update object for new bite incidents
export const buildMedicalHistoryUpdate = (formData) => {
  if (!formData.hasAllergies && !formData.hasReceivedVaccine) {
    return null
  }

  return {
    hasAllergies: formData.hasAllergies,
    allergies: formData.hasAllergies === 'yes' ? formData.allergies : '',
    hasReceivedVaccine: formData.hasReceivedVaccine,
    lastShotDate:
      formData.hasReceivedVaccine === 'yes' ? formData.lastShotDate : ''
  }
}
