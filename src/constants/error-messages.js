// firebase authentication error messages (maps firebase error codes to user-friendly messages)
export const FIREBASE_AUTH_ERRORS = {
  'auth/email-already-in-use':
    'This email address is already registered. Please use a different email or try logging in.',
  'auth/invalid-email':
    'The email address format is invalid. Please check and try again.',
  'auth/weak-password':
    'The password does not meet security requirements. Please try again.',
  'auth/network-request-failed':
    'Network connection error. Please check your internet connection and try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/operation-not-allowed':
    'This operation is not allowed. Please contact support.'
}

// firebase database error messages
export const FIREBASE_DB_ERRORS = {
  'permission-denied':
    'You do not have permission to perform this action. Please contact support.',
  unavailable:
    'The service is temporarily unavailable. Please try again later.',
  'data-stale': 'The data has been modified. Please refresh and try again.'
}

// validation error messages
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: 'This field is required.',
  INVALID_NAME: 'Name must not contain numbers or special characters.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid Philippine mobile number (09XXXXXXXXX).',
  INVALID_ZIP_CODE: 'Zip code must contain only numbers.',
  INVALID_DATE: 'Please enter a valid date.',
  FUTURE_DATE: 'Date cannot be in the future.',
  PAST_DATE: 'Date cannot be in the past.',
  MIN_LENGTH: (min) => `Must be at least ${min} characters long.`,
  MAX_LENGTH: (max) => `Must not exceed ${max} characters.`,
  PASSWORD_MISMATCH: 'Passwords do not match.',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions.',
  RECAPTCHA_REQUIRED: 'Please complete the reCAPTCHA verification.'
}

// registration error messages
export const REGISTRATION_ERRORS = {
  GENERAL: 'Registration failed. Please try again.',
  PASSWORD_GENERATION:
    'Failed to generate password. Please check your date of birth.',
  MISSING_DATA:
    'Please complete all required fields correctly before submitting.',
  EMAIL_IN_USE_SHORT: 'This email is already registered.',
  INVALID_EMAIL_SHORT: 'Invalid email format.'
}

// form validation messages
export const FORM_MESSAGES = {
  STEP1_ERROR:
    'Please fill in all required fields correctly before proceeding.',
  STEP2_ERROR:
    'Please complete all required fields correctly before submitting.',
  SAVE_DRAFT: 'Your progress has been saved.',
  CLEAR_DRAFT: 'Your saved progress has been cleared.'
}

// profile image upload error messages
export const PROFILE_IMAGE_ERRORS = {
  FILE_REQUIRED: 'Please select an image file.',
  INVALID_FILE_TYPE:
    'Invalid file type. Please select a valid image file (PNG, JPG, or JPEG).',
  FILE_TOO_LARGE: 'File size too large. Maximum size is 5MB.',
  UPLOAD_FAILED: 'Failed to update profile image. Please try again later.',
  UNAUTHORIZED: 'You do not have permission to upload images.',
  UPLOAD_CANCELED: 'Upload was canceled.',
  UNKNOWN_ERROR: 'An unknown error occurred during upload.',
  NO_USER: 'No authenticated user found. Please log in again.',
  SUCCESS: 'Your profile image has been updated successfully.'
}

// password change error messages
export const PASSWORD_CHANGE_ERRORS = {
  CURRENT_PASSWORD_REQUIRED: 'Current password is required.',
  NEW_PASSWORD_REQUIRED: 'New password is required.',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your new password.',
  PASSWORD_MISMATCH: 'Passwords do not match. Please try again.',
  PASSWORD_REQUIREMENTS_NOT_MET:
    'Password does not meet the requirements. Please try again.',
  INCORRECT_CURRENT_PASSWORD: 'Incorrect current password. Please try again.',
  UNABLE_TO_VERIFY: 'Unable to verify your current password. Please try again.',
  WEAK_PASSWORD:
    'The new password is too weak. Please choose a stronger password.',
  REQUIRES_RECENT_LOGIN:
    'For security reasons, please log out and log back in before changing your password.',
  UPDATE_FAILED: 'Something went wrong. Please try again.',
  SUCCESS: 'Your password has been changed successfully.'
}

// login error messages
export const LOGIN_ERRORS = {
  EMAIL_REQUIRED: 'Email is required!',
  PASSWORD_REQUIRED: 'Password is required!',
  RECAPTCHA_REQUIRED: 'Please check the recaptcha.',
  INVALID_CREDENTIALS: (remainingAttempts) =>
    remainingAttempts > 0
      ? `Invalid email or password! Please try again. You have ${remainingAttempts} attempt(s) remaining.`
      : 'Invalid email or password! Please try again.',
  ACCOUNT_LOCKED: (minutes) =>
    `Account is locked. Please wait ${minutes} minute(s) before trying again.`,
  LOCKOUT_WARNING_BASE:
    'Account locked due to multiple failed login attempts. Please wait',
  LOCKOUT_WARNING_END: 'before trying again.',
  TOO_MANY_ATTEMPTS: (minutes) =>
    `Too many failed login attempts. Please wait ${minutes} minutes before trying again.`
}

// email verification messages
export const VERIFICATION_MESSAGES = {
  ACCOUNT_NOT_VERIFIED:
    'Your account is not verified. Please verify it first. Click the button below to verify your account.',
  ACCOUNT_NOT_VERIFIED_SIMPLE:
    'Your account is not verified. Please verify it first.',
  EMAIL_SENT: 'Verification email sent! Please check your inbox.',
  EMAIL_NOT_VERIFIED:
    'Email not verified yet. Please check your inbox and try again.',
  SESSION_LOST: 'User session lost. Please go back and try again.',
  FAILED_TO_SEND: 'Failed to send verification email. Please try again.',
  TOO_MANY_REQUESTS:
    'You have requested this too many times. Please wait a moment and try again.',
  ROLE_NOT_FOUND: 'User role not found. Please contact support.'
}

// get user-friendly error message from firebase error code
export const getFirebaseErrorMessage = (
  errorCode,
  defaultMessage = 'An unexpected error occurred. Please try again.'
) => {
  return (
    FIREBASE_AUTH_ERRORS[errorCode] ||
    FIREBASE_DB_ERRORS[errorCode] ||
    defaultMessage
  )
}

// get validation error message
export const getValidationError = (fieldName, validationType, params) => {
  const message = VALIDATION_ERRORS[validationType]

  if (typeof message === 'function') {
    return message(params)
  }

  return message || VALIDATION_ERRORS.REQUIRED_FIELD
}

// firebase error code lists
export const AUTH_ERROR_CODES = [
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
  'auth/invalid-email',
  'auth/user-disabled'
]

export const RATE_LIMIT_ERROR_CODE = 'auth/too-many-requests'

export const EMAIL_ALREADY_IN_USE_CODE = 'auth/email-already-in-use'

export const INVALID_EMAIL_CODE = 'auth/invalid-email'

export const WEAK_PASSWORD_CODE = 'auth/weak-password'

export const NETWORK_ERROR_CODE = 'auth/network-request-failed'

export const WRONG_PASSWORD_CODE = 'auth/wrong-password'

export const INVALID_CREDENTIAL_CODE = 'auth/invalid-credential'

export const REQUIRES_RECENT_LOGIN_CODE = 'auth/requires-recent-login'

export const NO_USER_CODE = 'auth/no-user'

// check if error code is an authentication error
export const isAuthError = (errorCode) => {
  return AUTH_ERROR_CODES.includes(errorCode)
}

// check if error code is a rate limit error
export const isRateLimitError = (errorCode) => {
  return errorCode === RATE_LIMIT_ERROR_CODE
}
