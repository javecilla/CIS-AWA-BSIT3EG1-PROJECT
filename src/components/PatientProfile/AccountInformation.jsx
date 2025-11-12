import { useState, useRef } from 'react'
import { auth } from '@/libs/firebase'
import { useUser } from '@/contexts/UserContext'
import Alert from '@/components/Alert'
import AccountInformationForm from '@/components/Forms/AccountInformationForm'
import { validatePasswordStrength } from '@/utils/field-validation'
import { validatePasswordChangeForm } from '@/utils/form-validation'
import { updatePassword } from '@/services/authService'
import {
  PASSWORD_CHANGE_ERRORS,
  NO_USER_CODE,
  WRONG_PASSWORD_CODE,
  INVALID_CREDENTIAL_CODE,
  WEAK_PASSWORD_CODE,
  REQUIRES_RECENT_LOGIN_CODE
} from '@/constants/error-messages'
import './AccountInformation.css'

function AccountInformation({ accountData, action = 'edit' }) {
  const { refreshUserData } = useUser()
  const currentPasswordRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    specialChar: false,
    uppercase: false,
    number: false
  })

  const { AlertComponent, showAlert } = Alert()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }

    if (name === 'newPassword') {
      const strengthCheck = validatePasswordStrength(value)
      setPasswordRequirements(strengthCheck.requirements)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const validation = validatePasswordChangeForm(formData)

    if (validation.hasErrors) {
      setValidationErrors(validation.errors)
      showAlert('Please fill in all required fields correctly.', 'danger', {
        persist: true
      })
      return
    }

    setIsSubmitting(true)

    try {
      const user = auth.currentUser

      if (!user) {
        showAlert(PASSWORD_CHANGE_ERRORS.UPDATE_FAILED, 'danger', {
          persist: true
        })
        setIsSubmitting(false)
        return
      }

      const result = await updatePassword(
        formData.currentPassword,
        formData.newPassword
      )

      if (result.success) {
        await refreshUserData()
        showAlert(PASSWORD_CHANGE_ERRORS.SUCCESS, 'success')

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
      } else {
        if (result.error.code === NO_USER_CODE) {
          showAlert(result.error.message, 'danger', { persist: true })
        } else if (
          result.error.code === WRONG_PASSWORD_CODE ||
          result.error.code === INVALID_CREDENTIAL_CODE
        ) {
          setValidationErrors({
            currentPassword: PASSWORD_CHANGE_ERRORS.INCORRECT_CURRENT_PASSWORD
          })
          showAlert(PASSWORD_CHANGE_ERRORS.UNABLE_TO_VERIFY, 'danger', {
            persist: true
          })

          setTimeout(() => {
            currentPasswordRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
            currentPasswordRef.current?.focus()
          }, 100)
        } else if (result.error.code === WEAK_PASSWORD_CODE) {
          showAlert(PASSWORD_CHANGE_ERRORS.WEAK_PASSWORD, 'danger', {
            persist: true
          })
        } else if (result.error.code === REQUIRES_RECENT_LOGIN_CODE) {
          showAlert(PASSWORD_CHANGE_ERRORS.REQUIRES_RECENT_LOGIN, 'danger', {
            persist: true
          })
        } else {
          showAlert(
            result.error.message || PASSWORD_CHANGE_ERRORS.UPDATE_FAILED,
            'danger',
            {
              persist: true
            }
          )
        }
      }
    } catch (error) {
      console.error('Password update error:', error)
      showAlert(PASSWORD_CHANGE_ERRORS.UPDATE_FAILED, 'danger', {
        persist: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="account-form-section">
      <AlertComponent />

      <form onSubmit={handleUpdate}>
        <AccountInformationForm
          accountData={accountData}
          formData={formData}
          validationErrors={validationErrors}
          passwordRequirements={passwordRequirements}
          isSubmitting={isSubmitting}
          action={action}
          currentPasswordRef={currentPasswordRef}
          onInputChange={handleInputChange}
        />

        {action === 'edit' && (
          <button
            type="submit"
            className="btn btn-primary update-account-btn w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        )}
      </form>
    </div>
  )
}

export default AccountInformation
