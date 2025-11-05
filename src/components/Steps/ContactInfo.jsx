import { useEffect } from 'react'
import registerImage from '@/assets/images/register-step2-image.png'
import logoClinic from '@/assets/images/logo-clinic.png'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ContactInfo({
  formData,
  handleChange,
  nextStep,
  prevStep,
  showErrors,
  isSubmitting,
  registrationError,
  generalError,
  emailFieldError,
  emailInputRef,
  recaptchaToken,
  setRecaptchaToken,
  recaptchaError,
  setRecaptchaError,
  recaptchaRef,
  RECAPTCHA_SITE_KEY
}) {
  const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <div className="row align-items-start">
      <div className="col-lg-6 mb-4 mb-lg-0 p-0">
        <img src={registerImage} className="w-100 rounded-4" />
      </div>

      <div className="col-lg-6 px-4">
        <div className="d-flex align-items-center mb-3">
          <img src={logoClinic} className="logo-circle me-3" />
          <div>
            <h4 className="fw-medium mb-0">Animal Bite</h4>
            <h4 className="fw-bold">CENTER</h4>
          </div>
        </div>

        <h5 className="fw-semibold mb-4">Patient Registration</h5>

        <div className="d-flex justify-content-center align-items-center mb-0 gap-2 mx-4">
          <div className="text-center">
            <div className="step-circle active">1</div>
            <p className="small fw-medium mt-2">Personal Information</p>
          </div>

          <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

          <div className="text-center">
            <div className="step-circle active">2</div>
            <p className="small fw-medium mt-2">Contact Information</p>
          </div>

          <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

          <div className="text-center">
            <div className="step-circle">3</div>
            <p className="small fw-medium mt-2">Finished</p>
          </div>
        </div>

        <h6 className="fw-bold mb-3">CONTACT INFORMATION</h6>

        {/* Registration Error Alert */}
        {registrationError && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
            <div>{registrationError}</div>
          </div>
        )}

        <div className="row g-3">
          <div
            className={`col-md-12 ${
              showErrors &&
              (!formData.mobileNumber ||
                !/^(09|\+639)\d{9}$/.test(formData.mobileNumber))
                ? 'my-0'
                : ''
            }`}
          >
            <label className="fw-medium">Mobile Number:</label>
            <small className="text-muted d-block mb-1 text-description">
              Used for sending critical SMS reminders. Please ensure it is
              correct and active.
            </small>
            <input
              type="text"
              className={`form-control mt-1 ${
                showErrors &&
                (!formData.mobileNumber ||
                  !/^(09|\+639)\d{9}$/.test(formData.mobileNumber))
                  ? 'is-invalid'
                  : ''
              }`}
              name="mobileNumber"
              placeholder="e.g., 09*******22"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {showErrors && !formData.mobileNumber && (
              <div className="invalid-feedback d-block">
                Mobile number is required.
              </div>
            )}
            {showErrors &&
              formData.mobileNumber &&
              !/^(09|\+639)\d{9}$/.test(formData.mobileNumber) && (
                <div className="invalid-feedback d-block">
                  Invalid PH mobile number format.
                </div>
              )}
          </div>

          <div
            className={`col-md-12 ${
              showErrors &&
              (!formData.emailAddress ||
                !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                  formData.emailAddress
                ) ||
                emailFieldError) // NEW: Include emailFieldError in condition
                ? 'my-0'
                : ''
            }`}
          >
            <label className="fw-medium">Email Address:</label>
            <small className="text-muted d-block mb-1 text-description">
              Digital copies of receipts and medical records will be sent here
              and serve as your username in portal.
            </small>
            <input
              ref={emailInputRef} // NEW: Attach the ref
              type="email"
              className={`form-control mt-1 ${
                showErrors &&
                (!formData.emailAddress ||
                  !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                    formData.emailAddress
                  ) ||
                  emailFieldError) // NEW: Include emailFieldError
                  ? 'is-invalid'
                  : ''
              }`}
              name="emailAddress"
              placeholder="e.g., john.doe@example.net"
              value={formData.emailAddress}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {showErrors && !formData.emailAddress && (
              <div className="invalid-feedback d-block">
                Email address is required.
              </div>
            )}
            {showErrors &&
              formData.emailAddress &&
              !emailFieldError && // NEW: Only show format error if no specific field error
              !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                formData.emailAddress
              ) && (
                <div className="invalid-feedback d-block">
                  Invalid email format.
                </div>
              )}
            {/* NEW: Show field-specific error */}
            {emailFieldError && (
              <div className="invalid-feedback d-block">{emailFieldError}</div>
            )}
          </div>

          <div
            className={`col-md-12 ${
              showErrors &&
              (!formData.emergencyContactName ||
                !nameRegex.test(formData.emergencyContactName))
                ? 'my-0'
                : ''
            }`}
          >
            <label className="fw-medium">Emergency Contact Name:</label>
            <small className="text-muted d-block mb-1 text-description">
              Who should we call in an emergency?
            </small>

            <input
              type="text"
              className={`form-control mt-1 ${
                showErrors &&
                (!formData.emergencyContactName ||
                  !nameRegex.test(formData.emergencyContactName))
                  ? 'is-invalid'
                  : ''
              }`}
              name="emergencyContactName"
              placeholder="e.g., Jane Smith"
              value={formData.emergencyContactName}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {showErrors && !formData.emergencyContactName && (
              <div className="invalid-feedback d-block">
                Emergency contact name is required.
              </div>
            )}

            {showErrors &&
              formData.emergencyContactName &&
              !nameRegex.test(formData.emergencyContactName) && (
                <div className="invalid-feedback d-block">
                  Name must not contain numbers.
                </div>
              )}
          </div>

          <div
            className={`col-md-6 ${
              showErrors &&
              (!formData.emergencyContactRelationship ||
                !nameRegex.test(formData.emergencyContactRelationship) ||
                !formData.emergencyContactNumber ||
                !/^(09|\+639)\d{9}$/.test(formData.emergencyContactNumber))
                ? 'my-0'
                : ''
            }`}
          >
            <label className="fw-medium">Relationship to Patient:</label>
            <small className="text-muted d-block mb-1 text-description">
              What is their relationship to the patient?
            </small>

            <input
              type="text"
              className={`form-control mt-1 ${
                showErrors &&
                (!formData.emergencyContactRelationship ||
                  !nameRegex.test(formData.emergencyContactRelationship))
                  ? 'is-invalid'
                  : ''
              }`}
              name="emergencyContactRelationship"
              placeholder="e.g., Spouse, Mother, Sibling"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {showErrors && !formData.emergencyContactRelationship && (
              <div className="invalid-feedback d-block">
                This field is required.
              </div>
            )}

            {showErrors &&
              formData.emergencyContactRelationship &&
              !nameRegex.test(formData.emergencyContactRelationship) && (
                <div className="invalid-feedback d-block">
                  Relationship must not contain numbers.
                </div>
              )}
          </div>

          <div
            className={`col-md-6 ${
              showErrors &&
              (!formData.emergencyContactRelationship ||
                !nameRegex.test(formData.emergencyContactRelationship) ||
                !formData.emergencyContactNumber ||
                !/^(09|\+639)\d{9}$/.test(formData.emergencyContactNumber))
                ? 'my-0'
                : ''
            }`}
          >
            <label className="fw-medium">
              Emergency Contact's Mobile Number:
            </label>
            <small className="text-muted d-block mb-1 text-description">
              Enter mobile number of emergency contact.
            </small>

            <input
              type="text"
              className={`form-control mt-1 ${
                showErrors &&
                (!formData.emergencyContactNumber ||
                  !/^(09|\+639)\d{9}$/.test(formData.emergencyContactNumber))
                  ? 'is-invalid'
                  : ''
              }`}
              name="emergencyContactNumber"
              placeholder="e.g., 09*******88"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {showErrors && !formData.emergencyContactNumber && (
              <div className="invalid-feedback d-block">
                Mobile number is required.
              </div>
            )}

            {showErrors &&
              formData.emergencyContactNumber &&
              !/^(09|\+639)\d{9}$/.test(formData.emergencyContactNumber) && (
                <div className="invalid-feedback d-block">
                  Invalid PH mobile number format.
                </div>
              )}
          </div>

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
              <label className="form-check-label">
                <input
                  className={`form-check-input ${
                    showErrors && !formData.hasReviewed ? 'is-invalid' : ''
                  }`}
                  type="checkbox"
                  name="hasReviewed"
                  checked={formData.hasReviewed}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                I have reviewed all the information and confirm that it is
                accurate.
              </label>
            </div>

            <div className="form-check">
              <label className="form-check-label">
                <input
                  className={`form-check-input ${
                    showErrors && !formData.hasConsent ? 'is-invalid' : ''
                  }`}
                  type="checkbox"
                  name="hasConsent"
                  checked={formData.hasConsent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                I consent to the collection and processing of my personal data
                for treatment purposes, in accordance with the Data Privacy Act
                of 2012.
              </label>
            </div>

            <div className="form-check">
              <label className="form-check-label">
                <input
                  className={`form-check-input ${
                    showErrors && !formData.hasAgreed ? 'is-invalid' : ''
                  }`}
                  type="checkbox"
                  name="hasAgreed"
                  checked={formData.hasAgreed}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                I agree to receive SMS and email reminders for my appointments
                and vaccination schedule.
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2 d-flex justify-content-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => {
              setRecaptchaToken(token)
              setRecaptchaError('')
            }}
            onExpired={() => {
              setRecaptchaToken(null)
              setRecaptchaError('reCAPTCHA has expired. Please verify again.')
            }}
            onError={() => {
              setRecaptchaToken(null)
              setRecaptchaError('reCAPTCHA error occurred. Please try again.')
            }}
          />
        </div>

        {recaptchaError && (
          <div className="text-danger text-center small mb-2">
            {recaptchaError}
          </div>
        )}

        <hr className="my-2 divider" />

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-previous px-5 py-2 fs-5"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Previous
          </button>

          <button
            className="btn btn-submit px-5 py-2 fs-5"
            onClick={nextStep}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
