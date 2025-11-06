import { useState, useRef } from 'react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth'
import { auth } from '@/libs/firebase'
import { useUser } from '@/contexts/UserContext'
import DefaultProfile from '@/assets/images/default-profile.png'
import './AccountInformation.css'

function AccountInformation({ accountData }) {
  const { refreshUserData } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Refs for scrolling to fields
  const currentPasswordRef = useRef(null)

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    specialChar: false,
    uppercase: false,
    number: false
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }

    // Clear general messages when user starts typing
    if (generalError) setGeneralError('')
    if (successMessage) setSuccessMessage('')

    // Check password requirements in real-time
    if (name === 'newPassword') {
      setPasswordRequirements({
        minLength: value.length >= 8,
        specialChar: /[!@#$%&^*+\-]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value)
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    // Validate current password
    if (!formData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required.'
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      errors.newPassword = 'New password is required.'
    } else {
      const meetsRequirements =
        formData.newPassword.length >= 8 &&
        /[!@#$%&^*+\-]/.test(formData.newPassword) &&
        /[A-Z]/.test(formData.newPassword) &&
        /[0-9]/.test(formData.newPassword)

      if (!meetsRequirements) {
        errors.newPassword =
          'Password does not meet the requirements. Please try again.'
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password.'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please try again.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setGeneralError('')
    setSuccessMessage('')

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const user = auth.currentUser

      if (!user) {
        setGeneralError('No authenticated user found. Please log in again.')
        setIsSubmitting(false)
        return
      }

      // Step 1: Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      )

      try {
        await reauthenticateWithCredential(user, credential)
      } catch (reauthError) {
        console.error('Reauthentication error:', reauthError)

        if (
          reauthError.code === 'auth/wrong-password' ||
          reauthError.code === 'auth/invalid-credential'
        ) {
          setValidationErrors({
            currentPassword: 'Incorrect current password. Please try again.'
          })

          setGeneralError(
            'Unable to verify your current password. Please try again.'
          )

          // Scroll to current password field
          setTimeout(() => {
            currentPasswordRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
            currentPasswordRef.current?.focus()
          }, 100)
        } else {
          setGeneralError(
            'Failed to verify current password. Please try again.'
          )
        }
        setIsSubmitting(false)
        return
      }

      // Step 2: Update password
      await updatePassword(user, formData.newPassword)

      // Step 3: Refresh user data to ensure context stays updated
      await refreshUserData()

      // Step 4: Show success message and reset form
      setSuccessMessage('Your password has been changed successfully.')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordRequirements({
        minLength: false,
        specialChar: false,
        uppercase: false,
        number: false
      })
    } catch (error) {
      console.error('Password update error:', error)

      if (error.code === 'auth/weak-password') {
        setGeneralError(
          'The new password is too weak. Please choose a stronger password.'
        )
      } else if (error.code === 'auth/requires-recent-login') {
        setGeneralError(
          'For security reasons, please log out and log back in before changing your password.'
        )
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="account-info-card">
        {/*MyProfile Image*/}
        <div className="profile-image-section">
          <form className="profile-image-form d-flex flex-column align-items-center">
            <div className="profile-image-wrapper mb-3">
              <img
                src={accountData?.profileImage || DefaultProfile}
                alt="Profile"
                className="profile-img"
              />
            </div>
            <div className="profile-upload-controls">
              <input
                type="file"
                className="form-control file-select-input"
                placeholder="Select file"
                readOnly
              />
              <button type="submit" className="btn btn-primary save-file-btn">
                Save
              </button>
            </div>
          </form>
        </div>

        <br />

        <div className="account-form-section">
          <form onSubmit={handleUpdate}>
            <h3 className="section-title">ACCOUNT INFORMATION</h3>

            {/* Success Message */}
            {successMessage && (
              <div
                className="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <i className="fa-solid fa-circle-check bi flex-shrink-0 me-2"></i>
                <div>{successMessage}</div>
              </div>
            )}

            {/* Error Message */}
            {generalError && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
                <div>{generalError}</div>
              </div>
            )}

            {/* Email */}
            <div className="form-group ai-email-group">
              <label className="form-label">Email / Username:</label>
              <small className="text-muted d-block mb-1">
                Email cannot be changed for security purposes.
              </small>
              <input
                type="email"
                className="form-control"
                value={accountData?.email || ''}
                readOnly={true}
              />
            </div>

            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password:</label>
              <small className="text-muted d-block mb-1">
                Your current password is not displayed here for security
                purposes.
              </small>
              <input
                ref={currentPasswordRef}
                type="password"
                name="currentPassword"
                className={`form-control ${
                  validationErrors.currentPassword ? 'is-invalid' : ''
                }`}
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {validationErrors.currentPassword && (
                <div className="invalid-feedback">
                  {validationErrors.currentPassword}
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password:</label>
              <small>
                <span className="text-muted d-block mb-1">
                  Your password must have the following:
                </span>
                <ul className="text-muted pl-3">
                  <li
                    className={
                      passwordRequirements.minLength
                        ? 'text-success fw-bold'
                        : ''
                    }
                  >
                    8 character minimum
                  </li>
                  <li
                    className={
                      passwordRequirements.specialChar
                        ? 'text-success fw-bold'
                        : ''
                    }
                  >
                    1 allowed special character (! @ # $ % & ^ * + -)
                  </li>
                  <li
                    className={
                      passwordRequirements.uppercase
                        ? 'text-success fw-bold'
                        : ''
                    }
                  >
                    1 uppercase letter (A-Z)
                  </li>
                  <li
                    className={
                      passwordRequirements.number ? 'text-success fw-bold' : ''
                    }
                  >
                    1 number (0-9)
                  </li>
                </ul>
              </small>
              <input
                type="password"
                name="newPassword"
                className={`form-control ${
                  validationErrors.newPassword ? 'is-invalid' : ''
                }`}
                placeholder="Your strong new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {validationErrors.newPassword && (
                <div className="invalid-feedback">
                  {validationErrors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password:</label>
              <small className="text-muted d-block mb-1">
                Please re-enter your new password for confirmation.
              </small>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${
                  validationErrors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Re-enter your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {validationErrors.confirmPassword && (
                <div className="invalid-feedback">
                  {validationErrors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary update-account-btn w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AccountInformation
