// name validation pattern (allows letters (including Spanish characters), spaces, hyphens, periods, and apostrophes)
export const NAME_REGEX = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/

// email validation pattern (standard email format validation)
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

// philippine mobile number validation pattern (supports formats: 09XXXXXXXXX or +639XXXXXXXXX)
export const PHONE_REGEX = /^(09|\+639)\d{9}$/

// zip code validation pattern (allows only numeric characters)
export const ZIP_CODE_REGEX = /^[0-9]+$/

// alphanumeric pattern (allows letters and numbers only)
export const ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/

// address pattern (allows letters, numbers, spaces, commas, periods, and hyphens)
export const ADDRESS_REGEX = /^[A-Za-zÑñáéíóúÁÉÍÓÚ0-9\s,.\-#]+$/

// address alphanumeric pattern (for House No. & Street) (allows letters, numbers, spaces, and dot (.) symbol only)
export const ADDRESS_ALPHANUMERIC_REGEX = /^[A-Za-z0-9\s.]+$/

// zip code pattern (exactly 4 digits) (must be exactly 4 numeric digits)
export const ZIP_CODE_4_DIGITS_REGEX = /^[0-9]{4}$/

// barangay validation pattern (allows letters (including enye), numbers, spaces, and dot (.) symbol only)
export const BARANGAY_REGEX = /^[A-Za-zÑñáéíóúÁÉÍÓÚ0-9\s.]+$/
