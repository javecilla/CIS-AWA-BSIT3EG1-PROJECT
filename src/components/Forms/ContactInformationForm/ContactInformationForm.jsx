import './ContactInformationForm.css'

export default function ContactInformationForm({
  formData,
  handleChange,
  errors = {},
  isSubmitting = false,
  disabled = false,
  emailFieldError = '',
  emailInputRef = null,
  handleBlur = null,
  includeConsent = true,
  includeEmail = true
}) {
  return (
    <div className="row g-3">
      <div className={`col-md-12 ${errors.mobileNumber ? 'my-0' : ''}`}>
        <label className="fw-medium">Mobile Number:</label>
        <small className="text-muted d-block mb-1 text-description">
          Used for sending critical SMS reminders. Please ensure it is correct
          and active.
        </small>
        <input
          type="text"
          className={`form-control mt-1 ${
            errors.mobileNumber ? 'is-invalid' : ''
          }`}
          name="mobileNumber"
          placeholder="e.g., 09*******22"
          value={formData.mobileNumber || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.mobileNumber && (
          <div className="invalid-feedback d-block">{errors.mobileNumber}</div>
        )}
      </div>

      {includeEmail && (
        <>
          <div
            className={`col-md-12 ${
              errors.emailAddress || emailFieldError ? 'my-0' : ''
            }`}
          >
            <label className="fw-medium">Email Address:</label>
            <small className="text-muted d-block mb-1 text-description">
              Digital copies of receipts and medical records will be sent here
              and serve as your username in portal.
            </small>
            <input
              ref={emailInputRef}
              type="email"
              className={`form-control mt-1 ${
                errors.emailAddress || emailFieldError ? 'is-invalid' : ''
              }`}
              name="emailAddress"
              placeholder="e.g., john.doe@example.net"
              value={formData.emailAddress || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || disabled}
            />
            {(emailFieldError || errors.emailAddress) && (
              <div className="invalid-feedback d-block">
                {emailFieldError || errors.emailAddress}
              </div>
            )}
          </div>
        </>
      )}

      <div className={`col-md-12 ${errors.emergencyContactName ? 'my-0' : ''}`}>
        <label className="fw-medium">Emergency Contact Name:</label>
        <small className="text-muted d-block mb-1 text-description">
          Who should we call in an emergency?
        </small>
        <input
          type="text"
          className={`form-control mt-1 ${
            errors.emergencyContactName ? 'is-invalid' : ''
          }`}
          name="emergencyContactName"
          placeholder="e.g., Jane Smith"
          value={formData.emergencyContactName || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.emergencyContactName && (
          <div className="invalid-feedback d-block">
            {errors.emergencyContactName}
          </div>
        )}
      </div>

      <div
        className={`col-md-6 ${
          errors.emergencyContactRelationship ? 'my-0' : ''
        }`}
      >
        <label className="fw-medium">Relationship to Patient:</label>
        <small className="text-muted d-block mb-1 text-description">
          What is their relationship to the patient?
        </small>
        <input
          type="text"
          className={`form-control mt-1 ${
            errors.emergencyContactRelationship ? 'is-invalid' : ''
          }`}
          name="emergencyContactRelationship"
          placeholder="e.g., Spouse, Mother, Sibling"
          value={formData.emergencyContactRelationship || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.emergencyContactRelationship && (
          <div className="invalid-feedback d-block">
            {errors.emergencyContactRelationship}
          </div>
        )}
      </div>

      <div
        className={`col-md-6 ${errors.emergencyContactNumber ? 'my-0' : ''}`}
      >
        <label className="fw-medium">Emergency Contact's Mobile Number:</label>
        <small className="text-muted d-block mb-1 text-description">
          Enter mobile number of emergency contact.
        </small>
        <input
          type="text"
          className={`form-control mt-1 ${
            errors.emergencyContactNumber ? 'is-invalid' : ''
          }`}
          name="emergencyContactNumber"
          placeholder="e.g., 09*******88"
          value={formData.emergencyContactNumber || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.emergencyContactNumber && (
          <div className="invalid-feedback d-block">
            {errors.emergencyContactNumber}
          </div>
        )}
      </div>

      {includeConsent && (
        <div className="col-md-12 mt-1 mx-1">
          <h6 className="fw-bold mb-2 fs-5 title-text">REVIEW & CONSENT</h6>
          <p className="fw-medium mb-2 text-description fs-6">
            Data Privacy and Communication Consent
          </p>
          <p className="mb-3 text-description">
            Please review and check the following boxes to complete the
            registration.
          </p>
          <div className="form-check">
            <input
              className={`form-check-input ${
                errors.hasReviewed ? 'is-invalid' : ''
              }`}
              type="checkbox"
              name="hasReviewed"
              checked={formData.hasReviewed || false}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
            <label className="form-check-label">
              I have reviewed all the information and confirm that it is
              accurate.
            </label>
            {errors.hasReviewed && (
              <div className="invalid-feedback d-block">
                {errors.hasReviewed}
              </div>
            )}
          </div>

          <div className="form-check">
            <input
              className={`form-check-input ${
                errors.hasConsent ? 'is-invalid' : ''
              }`}
              type="checkbox"
              name="hasConsent"
              checked={formData.hasConsent || false}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
            <label className="form-check-label">
              I consent to the collection and processing of my personal data for
              treatment purposes, in accordance with the Data Privacy Act of
              2012.
            </label>
            {errors.hasConsent && (
              <div className="invalid-feedback d-block">
                {errors.hasConsent}
              </div>
            )}
          </div>

          <div className="form-check">
            <input
              className={`form-check-input ${
                errors.hasAgreed ? 'is-invalid' : ''
              }`}
              type="checkbox"
              name="hasAgreed"
              checked={formData.hasAgreed || false}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
            <label className="form-check-label">
              I agree to receive SMS and email reminders for my appointments and
              vaccination schedule.
            </label>
            {errors.hasAgreed && (
              <div className="invalid-feedback d-block">{errors.hasAgreed}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
