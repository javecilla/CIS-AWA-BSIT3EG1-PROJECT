// personal information form fields (step 1)
export const PERSONAL_INFO_FIELDS = {
  firstName: {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'e.g., John',
    description: "Please enter patient's first name.",
    required: true,
    validation: 'name'
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'e.g., Doe',
    description: "Please enter patient's last name.",
    required: true,
    validation: 'name'
  },
  middleName: {
    name: 'middleName',
    label: 'Middle Name',
    type: 'text',
    placeholder: 'e.g., Miller',
    description: 'Optional. Leave blank if not applicable.',
    required: false,
    validation: 'name'
  },
  suffix: {
    name: 'suffix',
    label: 'Suffix',
    type: 'text',
    placeholder: 'e.g., Jr., Sr., III',
    description: 'Optional. Leave blank if not applicable.',
    required: false,
    validation: 'name'
  },
  dateOfBirth: {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    description: 'Your birth date.',
    required: true,
    validation: 'date'
  },
  sex: {
    name: 'sex',
    label: 'Sex',
    type: 'select',
    description: 'Select your biological sex.',
    required: true,
    options: [
      { value: '', label: 'Select Sex' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ]
  },
  houseNoStreet: {
    name: 'houseNoStreet',
    label: 'House No. / Street',
    type: 'text',
    placeholder: 'e.g., 123 Main St.',
    description: 'Enter your house number and street name.',
    required: true,
    validation: 'address'
  },
  barangay: {
    name: 'barangay',
    label: 'Barangay',
    type: 'text',
    placeholder: 'e.g., Barangay San Jose',
    description: 'Enter your barangay.',
    required: true
  },
  cityMunicipality: {
    name: 'cityMunicipality',
    label: 'City / Municipality',
    type: 'text',
    placeholder: 'e.g., Malolos',
    description: 'Enter your city or municipality.',
    required: true,
    validation: 'name'
  },
  province: {
    name: 'province',
    label: 'Province',
    type: 'text',
    placeholder: 'e.g., Bulacan',
    description: 'Enter your province.',
    required: true,
    validation: 'name'
  },
  zipCode: {
    name: 'zipCode',
    label: 'Zip Code',
    type: 'text',
    placeholder: 'e.g., 3000',
    description: 'Optional. Enter your postal code.',
    required: false,
    validation: 'zipCode'
  }
}

// contact information form fields (step 2)
export const CONTACT_INFO_FIELDS = {
  mobileNumber: {
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'text',
    placeholder: 'e.g., 09*******22',
    description:
      'Used for sending critical SMS reminders. Please ensure it is correct and active.',
    required: true,
    validation: 'phone'
  },
  emailAddress: {
    name: 'emailAddress',
    label: 'Email Address',
    type: 'email',
    placeholder: 'e.g., john.doe@example.net',
    description:
      'Digital copies of receipts and medical records will be sent here and serve as your username in portal.',
    required: true,
    validation: 'email'
  },
  emergencyContactName: {
    name: 'emergencyContactName',
    label: 'Emergency Contact Name',
    type: 'text',
    placeholder: 'e.g., Jane Doe',
    description: 'Who should we call in an emergency?',
    required: true,
    validation: 'name'
  },
  emergencyContactRelationship: {
    name: 'emergencyContactRelationship',
    label: 'Relationship',
    type: 'text',
    placeholder: 'e.g., Mother, Father, Spouse',
    description: 'What is their relationship to you?',
    required: true,
    validation: 'name'
  },
  emergencyContactNumber: {
    name: 'emergencyContactNumber',
    label: 'Emergency Contact Number',
    type: 'text',
    placeholder: 'e.g., 09*******22',
    description: 'Mobile number of your emergency contact.',
    required: true,
    validation: 'phone'
  }
}

// consent checkboxes (step 2)
export const CONSENT_FIELDS = {
  hasReviewed: {
    name: 'hasReviewed',
    label:
      'I confirm that I have reviewed all the information I provided and it is accurate.',
    type: 'checkbox',
    required: true
  },
  hasConsent: {
    name: 'hasConsent',
    label:
      'I consent to the collection, use, and processing of my personal data in accordance with the Data Privacy Act of 2012.',
    type: 'checkbox',
    required: true
  },
  hasAgreed: {
    name: 'hasAgreed',
    label:
      'I agree to receive appointment reminders and health updates via SMS and email.',
    type: 'checkbox',
    required: true
  }
}

// initial form data structure
export const INITIAL_FORM_DATA = {
  // Personal Information
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
  // Contact Information
  mobileNumber: '',
  emailAddress: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactNumber: '',
  // Consents
  hasReviewed: false,
  hasConsent: false,
  hasAgreed: false
}

// required fields for step 1 (personal information)
export const STEP1_REQUIRED_FIELDS = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'sex',
  'houseNoStreet',
  'barangay',
  'cityMunicipality',
  'province'
]

// required fields for step 2 (contact information)
export const STEP2_REQUIRED_FIELDS = [
  'mobileNumber',
  'emailAddress',
  'emergencyContactName',
  'emergencyContactRelationship',
  'emergencyContactNumber',
  'hasReviewed',
  'hasConsent',
  'hasAgreed'
]

// fields that use step 1 for checking unsaved data
export const STEP1_DATA_FIELDS = [
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

// storage keys for localStorage
export const STORAGE_KEYS = {
  FORM_DATA: 'patientRegistrationFormData',
  CURRENT_STEP: 'patientRegistrationStep'
}
