import {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  ZIP_CODE_REGEX,
  ADDRESS_REGEX,
  ZIP_CODE_4_DIGITS_REGEX,
  BARANGAY_REGEX
} from '@/constants/regex-patterns'

export const validateEmailAddress = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Email address is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (!EMAIL_REGEX.test(value)) {
    return 'Invalid email format.'
  }

  return null
}

// validates email address and checks if it already exists
export const validateEmailAddressWithExistence = async (
  value,
  isRequired,
  checkEmailExists
) => {
  // check format and required
  const formatError = validateEmailAddress(value, isRequired)
  if (formatError) {
    return formatError
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (checkEmailExists) {
    try {
      const result = await checkEmailExists(value.trim())
      if (result.exists) {
        return 'This email address is already registered. Please use a different email or try logging in.'
      }
      if (result.error) {
        // if there's an error checking, don't block - format validation already passed
        return null
      }
    } catch (error) {
      // if check fails, don't block - format validation already passed
      console.error('Error checking email existence:', error)
      return null
    }
  }

  return null
}

export const validateMobileNumber = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Mobile number is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (!PHONE_REGEX.test(value)) {
    return 'Invalid PH mobile number format.'
  }

  return null
}

export const validateNameField = (value, isRequired, fieldLabel) => {
  if (isRequired && (!value || value.trim() === '')) {
    return `${fieldLabel} is required.`
  }

  if (!value || value.trim() === '') {
    return null
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length < 2) {
    return `${fieldLabel} must be at least 2 characters.`
  }

  if (!NAME_REGEX.test(trimmedValue)) {
    return `${fieldLabel} must not contain numbers or symbols.`
  }

  return null
}

export const validateDateOfBirth = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Date of Birth is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  const selectedDate = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate > today) {
    return 'Date of birth cannot be a future date.'
  }

  return null
}

export const validateSex = (value, isRequired) => {
  if (isRequired && (!value || value === '' || value === 'Select')) {
    return 'Sex is required.'
  }

  return null
}

export const validateAddress = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'House No. & Street is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  const trimmedValue = value.trim()

  if (!ADDRESS_REGEX.test(trimmedValue)) {
    return 'House No. & Street must contain only letters, numbers, spaces, commas, periods, and hyphens.'
  }

  return null
}

export const validateLocationField = (
  value,
  isRequired,
  fieldLabel,
  isBarangay = false
) => {
  if (isRequired && (!value || value.trim() === '')) {
    return `${fieldLabel} is required.`
  }

  if (!value || value.trim() === '') {
    return null
  }

  const trimmedValue = value.trim()

  if (isBarangay) {
    if (!BARANGAY_REGEX.test(trimmedValue)) {
      return `${fieldLabel} must contain only letters, numbers, spaces, and dot (.).`
    }
    return null
  }

  if (!NAME_REGEX.test(trimmedValue)) {
    return `${fieldLabel} must contain only letters and spaces (no numbers or symbols).`
  }

  return null
}

export const validateZipCode = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Zip code is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  const trimmedValue = value.trim()

  if (!ZIP_CODE_REGEX.test(trimmedValue)) {
    return 'Zip code must contain numbers only.'
  }

  if (!ZIP_CODE_4_DIGITS_REGEX.test(trimmedValue)) {
    return 'Zip code must be exactly 4 digits.'
  }

  return null
}

export const validateEmergencyContactName = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Emergency contact name is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (!NAME_REGEX.test(value)) {
    return 'Emergency contact name must not contain numbers.'
  }

  return null
}

export const validateEmergencyContactRelationship = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Relationship is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (!NAME_REGEX.test(value)) {
    return 'Relationship must not contain numbers.'
  }

  return null
}

export const validateEmergencyContactNumber = (value, isRequired) => {
  if (isRequired && (!value || value.trim() === '')) {
    return 'Emergency contact number is required.'
  }

  if (!value || value.trim() === '') {
    return null
  }

  if (!PHONE_REGEX.test(value)) {
    return 'Invalid PH mobile number format.'
  }

  return null
}

export const validateRecaptcha = (recaptchaToken) => {
  if (!recaptchaToken) {
    return 'Please complete the reCAPTCHA verification.'
  }

  return null
}

export const clearFieldError = (errors, field) => {
  const newErrors = { ...errors }
  delete newErrors[field]
  return newErrors
}

export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    specialChar: /[!@#$%&^*+\-]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  }

  const isValid =
    requirements.minLength &&
    requirements.specialChar &&
    requirements.uppercase &&
    requirements.number

  return {
    isValid,
    requirements
  }
}
