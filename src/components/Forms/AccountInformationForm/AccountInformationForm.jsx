import './AccountInformationForm.css'
import { formatDateTime } from '@/utils/formatter'

export default function AccountInformationForm({
  accountData,
  formData = {},
  validationErrors = {},
  passwordRequirements = {},
  isSubmitting = false,
  action = 'edit',
  currentPasswordRef = null,
  onInputChange = () => {}
}) {
  return (
    <>
      <h3 className="section-title">ACCOUNT INFORMATION</h3>

      {/* Email */}
      <div className="form-group ai-email-group">
        <label className="form-label">Email / Username:</label>
        <small
          className={`text-muted d-block mb-1 ${action === 'view' && 'd-none'}`}
        >
          Email cannot be changed for security purposes.
        </small>
        <input
          type="email"
          className="form-control"
          value={accountData?.email || ''}
          readOnly={true}
        />
      </div>

      {action === 'edit' ? (
        <>
          <div className="form-group">
            <label className="form-label">Current Password:</label>
            <small className="text-muted d-block mb-1">
              Your current password is not displayed here for security purposes.
            </small>
            <input
              ref={currentPasswordRef}
              type="password"
              name="currentPassword"
              className={`form-control ${
                validationErrors.currentPassword ? 'is-invalid' : ''
              }`}
              placeholder="Enter your current password"
              value={formData.currentPassword || ''}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
            {validationErrors.currentPassword && (
              <div className="invalid-feedback">
                {validationErrors.currentPassword}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">New Password:</label>
            <small>
              <span className="text-muted d-block mb-1">
                Your password must have the following:
              </span>
              <ul className="text-muted pl-3">
                <li
                  className={
                    passwordRequirements.minLength ? 'text-success fw-bold' : ''
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
                    passwordRequirements.uppercase ? 'text-success fw-bold' : ''
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
              value={formData.newPassword || ''}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
            {validationErrors.newPassword && (
              <div className="invalid-feedback">
                {validationErrors.newPassword}
              </div>
            )}
          </div>

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
              value={formData.confirmPassword || ''}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
            {validationErrors.confirmPassword && (
              <div className="invalid-feedback">
                {validationErrors.confirmPassword}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="form-group ai-email-group">
            <label className="form-label">Patient ID:</label>
            <input
              type="text"
              className="form-control"
              value={accountData?.patientId || ''}
              readOnly={true}
            />
          </div>
          <div className="form-group ai-email-group">
            <label className="form-label">Created At:</label>
            <input
              type="text"
              className="form-control"
              value={formatDateTime(accountData?.createdAt) || ''}
              readOnly={true}
            />
          </div>
        </>
      )}
    </>
  )
}
