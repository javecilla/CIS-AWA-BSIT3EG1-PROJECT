// Load form data from localStorage
export const loadFormData = (storageKey, defaultData) => {
  const savedData = localStorage.getItem(storageKey)

  if (savedData) {
    try {
      return JSON.parse(savedData)
    } catch (error) {
      console.error('Error parsing saved form data:', error)
    }
  }

  return defaultData
}

export const saveFormData = (storageKey, formData) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(formData))
  } catch (error) {
    console.error('Error saving form data:', error)
  }
}

export const clearFormData = (storageKey) => {
  try {
    localStorage.removeItem(storageKey)
  } catch (error) {
    console.error('Error clearing form data:', error)
  }
}

//load current step from localStorage
export const loadCurrentStep = (storageKey, defaultStep = 1) => {
  const savedStep = localStorage.getItem(storageKey)
  return savedStep ? parseInt(savedStep) : defaultStep
}

export const saveCurrentStep = (storageKey, step) => {
  try {
    localStorage.setItem(storageKey, step.toString())
  } catch (error) {
    console.error('Error saving current step:', error)
  }
}

//check if form has any data filled
export const hasFormData = (formData, fieldsToCheck) => {
  return fieldsToCheck.some((field) => {
    const value = formData[field]
    return value && value.toString().trim() !== ''
  })
}

//build patient data object for database
export const buildPatientData = ({
  patientId,
  formData,
  role,
  recaptchaToken
}) => {
  return {
    role: role,
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
    recaptchaToken: recaptchaToken
  }
}
