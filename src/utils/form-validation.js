import {
  validateNameField,
  validateDateOfBirth,
  validateSex,
  validateAddress,
  validateLocationField,
  validateZipCode,
  validateMobileNumber,
  validateEmailAddress,
  validateEmergencyContactName,
  validateEmergencyContactRelationship,
  validateEmergencyContactNumber,
  validateRecaptcha,
  validatePasswordStrength
} from '@/utils/field-validation'
import { LOGIN_ERRORS } from '@/constants/error-messages'

export const validateLoginForm = ({ email, password, recaptchaToken }) => {
  const errors = {}

  if (!email || email.trim() === '') {
    errors.email = LOGIN_ERRORS.EMAIL_REQUIRED
  }

  if (!password || password.trim() === '') {
    errors.password = LOGIN_ERRORS.PASSWORD_REQUIRED
  }

  if (!recaptchaToken) {
    errors.recaptcha = LOGIN_ERRORS.RECAPTCHA_REQUIRED
  }

  return errors
}

export const validatePersonalInformation = (formData, options = {}) => {
  const { requireAll = false } = options
  const errors = {}

  // Required fields
  const firstNameError = validateNameField(
    formData.firstName,
    true,
    'First name'
  )
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateNameField(formData.lastName, true, 'Last name')
  if (lastNameError) errors.lastName = lastNameError

  const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth, true)
  if (dateOfBirthError) errors.dateOfBirth = dateOfBirthError

  const sexError = validateSex(formData.sex, true)
  if (sexError) errors.sex = sexError

  const addressError = validateAddress(formData.houseNoStreet, true)
  if (addressError) errors.houseNoStreet = addressError

  const barangayError = validateLocationField(
    formData.barangay,
    true,
    'Barangay',
    true // isBarangay = true, allows numbers and dot
  )
  if (barangayError) errors.barangay = barangayError

  const cityError = validateLocationField(
    formData.cityMunicipality,
    true,
    'City / Municipality'
  )
  if (cityError) errors.cityMunicipality = cityError

  const provinceError = validateLocationField(
    formData.province,
    true,
    'Province'
  )
  if (provinceError) errors.province = provinceError

  // optional fields (only validate if they have values or requireAll is true)
  if (formData.middleName || requireAll) {
    const middleNameError = validateNameField(
      formData.middleName,
      requireAll,
      'Middle name'
    )
    if (middleNameError) errors.middleName = middleNameError
  }

  if (formData.suffix || requireAll) {
    const suffixError = validateNameField(formData.suffix, requireAll, 'Suffix')
    if (suffixError) errors.suffix = suffixError
  }

  if (formData.zipCode || requireAll) {
    const zipCodeError = validateZipCode(formData.zipCode, requireAll)
    if (zipCodeError) errors.zipCode = zipCodeError
  }

  return { errors, hasErrors: Object.keys(errors).length > 0 }
}

// validates consent checkboxes
export const validateConsentFields = (formData, includeConsent = true) => {
  const errors = {}

  if (includeConsent) {
    if (!formData.hasReviewed) {
      errors.hasReviewed = 'This is required.'
    }

    if (!formData.hasConsent) {
      errors.hasConsent = 'This is required.'
    }

    if (!formData.hasAgreed) {
      errors.hasAgreed = 'This is required.'
    }
  }

  return errors
}

// validates all contact information fields
export const validateContactInformation = async (formData, options = {}) => {
  const {
    includeConsent = true,
    recaptchaToken = null,
    requireRecaptcha = true,
    requireAll = false,
    checkEmailExists = null,
    includeEmail = true
  } = options
  const errors = {}

  // Required fields
  const mobileNumberError = validateMobileNumber(formData.mobileNumber, true)
  if (mobileNumberError) errors.mobileNumber = mobileNumberError

  if (includeEmail) {
    // check email format first
    const emailError = validateEmailAddress(formData.emailAddress, true)
    if (emailError) {
      errors.emailAddress = emailError
    } else if (
      checkEmailExists &&
      formData.emailAddress &&
      formData.emailAddress.trim()
    ) {
      // if format is valid, check if email exists
      try {
        const result = await checkEmailExists(formData.emailAddress.trim())
        if (result && result.exists) {
          errors.emailAddress =
            'This email address is already registered. Please use a different email or try logging in.'
        }
      } catch (error) {
        console.error('Error checking email existence:', error)
        // don't block if check fails - format validation already passed
      }
    }
  }

  const emergencyNameError = validateEmergencyContactName(
    formData.emergencyContactName,
    true
  )
  if (emergencyNameError) errors.emergencyContactName = emergencyNameError

  const relationshipError = validateEmergencyContactRelationship(
    formData.emergencyContactRelationship,
    true
  )
  if (relationshipError) errors.emergencyContactRelationship = relationshipError

  const emergencyNumberError = validateEmergencyContactNumber(
    formData.emergencyContactNumber,
    true
  )
  if (emergencyNumberError) errors.emergencyContactNumber = emergencyNumberError

  // Consent fields
  if (includeConsent) {
    const consentErrors = validateConsentFields(formData, includeConsent)
    Object.assign(errors, consentErrors)
  }

  // reCAPTCHA - only validate if required (default: true for patient registration)
  // Staff-side registration can set requireRecaptcha: false to skip this validation
  if (requireRecaptcha) {
    const recaptchaError = validateRecaptcha(recaptchaToken)
    if (recaptchaError) {
      errors.recaptcha = recaptchaError
    }
  }

  return { errors, hasErrors: Object.keys(errors).length > 0 }
}

// get error message for a specific field
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null
}

// check if field has error
export const hasFieldError = (errors, fieldName) => {
  return !!errors[fieldName]
}

// validates password change form
export const validatePasswordChangeForm = (formData) => {
  const errors = {}

  if (!formData.currentPassword || !formData.currentPassword.trim()) {
    errors.currentPassword = 'Current password is required.'
  }

  if (!formData.newPassword || !formData.newPassword.trim()) {
    errors.newPassword = 'New password is required.'
  } else {
    const strengthCheck = validatePasswordStrength(formData.newPassword)
    if (!strengthCheck.isValid) {
      errors.newPassword =
        'Password does not meet the requirements. Please try again.'
    }
  }

  if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm your new password.'
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match. Please try again.'
  }

  return {
    hasErrors: Object.keys(errors).length > 0,
    errors
  }
}

// validates new bite incident form
export const validateNewBiteForm = (formData) => {
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
  incidentDate.setHours(0, 0, 0, 0)
  if (incidentDate > today) {
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

// validates follow-up consultation form
export const validateFollowUpForm = (formData) => {
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

// get field-specific validation errors for new bite form
export const getNewBiteFormErrors = (formData, showErrors) => {
  if (!showErrors) return {}

  const errors = {}

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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const incidentDate = new Date(formData.incidentDate)
    incidentDate.setHours(0, 0, 0, 0)
    if (incidentDate > today) {
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
  if (!formData.biteLocation) errors.biteLocation = 'Bite location is required.'
  if (!formData.animalVaccinationStatus) {
    errors.animalVaccinationStatus = 'Animal vaccination status is required.'
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
  } else if (formData.hasReceivedVaccine === 'yes' && !formData.lastShotDate) {
    errors.lastShotDate = 'Please provide the date of your last shot.'
  }

  return errors
}

// get field-specific validation errors for follow-up form
export const getFollowUpFormErrors = (formData, showErrors) => {
  if (!showErrors) return {}

  const errors = {}

  // common fields
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

  // follow-up specific
  if (!formData.primaryReason) {
    errors.primaryReason = 'Primary reason for visit is required.'
  }
  if (!formData.newConditions) {
    errors.newConditions =
      'This field is required. Enter "None" if not applicable.'
  }
  if (!formData.confirmPolicy) {
    errors.confirmPolicy = 'You must confirm the details and agree to proceed.'
  }

  return errors
}
