/**
 * LocalStorage utility functions
 * Manages lockout, cooldown, and other persistent state
 */

// Storage keys
export const STORAGE_KEYS = {
  VERIFICATION_COOLDOWN: 'verification_cooldown_expiry',
  LOGIN_LOCKOUT: 'login_lockout_expiry',
  FAILED_ATTEMPTS: 'failed_login_attempts'
}

// Configuration constants
export const LOCKOUT_CONFIG = {
  MAX_ATTEMPTS: 3,
  LOCKOUT_DURATION: 60 // seconds
}

export const COOLDOWN_CONFIG = {
  VERIFICATION_DURATION: 60 // seconds
}

/**
 * Gets remaining time from localStorage expiry
 * @param {string} key - Storage key
 * @returns {number} Remaining seconds (0 if expired or not found)
 */
export const getRemainingTime = (key) => {
  const expiry = localStorage.getItem(key)
  if (!expiry) return 0

  const remainingTime = Math.max(
    0,
    Math.floor((parseInt(expiry) - Date.now()) / 1000)
  )

  // Clean up if expired
  if (remainingTime === 0) {
    localStorage.removeItem(key)
  }

  return remainingTime
}

/**
 * Sets expiry time in localStorage
 * @param {string} key - Storage key
 * @param {number} durationSeconds - Duration in seconds
 */
export const setExpiry = (key, durationSeconds) => {
  const expiryTime = Date.now() + durationSeconds * 1000
  localStorage.setItem(key, expiryTime.toString())
}

/**
 * Removes item from localStorage
 * @param {string} key - Storage key
 */
export const removeExpiry = (key) => {
  localStorage.removeItem(key)
}

/**
 * Gets failed login attempts count
 * @returns {number} Number of failed attempts
 */
export const getFailedAttempts = () => {
  const attempts = localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS)
  return attempts ? parseInt(attempts) : 0
}

/**
 * Increments failed login attempts
 * @returns {number} New attempt count
 */
export const incrementFailedAttempts = () => {
  const newCount = getFailedAttempts() + 1
  localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, newCount.toString())
  return newCount
}

/**
 * Resets failed login attempts
 */
export const resetFailedAttempts = () => {
  localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS)
}

/**
 * Checks if login is currently locked
 * @returns {Object} { isLocked: boolean, remainingSeconds: number }
 */
export const checkLoginLockout = () => {
  const remainingSeconds = getRemainingTime(STORAGE_KEYS.LOGIN_LOCKOUT)
  return {
    isLocked: remainingSeconds > 0,
    remainingSeconds
  }
}

/**
 * Sets login lockout
 */
export const setLoginLockout = () => {
  setExpiry(STORAGE_KEYS.LOGIN_LOCKOUT, LOCKOUT_CONFIG.LOCKOUT_DURATION)
}

/**
 * Clears login lockout and resets attempts
 */
export const clearLoginLockout = () => {
  removeExpiry(STORAGE_KEYS.LOGIN_LOCKOUT)
  resetFailedAttempts()
}

/**
 * Checks if verification cooldown is active
 * @returns {Object} { isActive: boolean, remainingSeconds: number }
 */
export const checkVerificationCooldown = () => {
  const remainingSeconds = getRemainingTime(STORAGE_KEYS.VERIFICATION_COOLDOWN)
  return {
    isActive: remainingSeconds > 0,
    remainingSeconds
  }
}

/**
 * Sets verification cooldown
 */
export const setVerificationCooldown = () => {
  setExpiry(
    STORAGE_KEYS.VERIFICATION_COOLDOWN,
    COOLDOWN_CONFIG.VERIFICATION_DURATION
  )
}

/**
 * Clears verification cooldown
 */
export const clearVerificationCooldown = () => {
  removeExpiry(STORAGE_KEYS.VERIFICATION_COOLDOWN)
}
