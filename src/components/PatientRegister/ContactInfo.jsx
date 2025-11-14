import { useEffect } from 'react'
import registerImage from '@/assets/images/register-step2-image.png'
import ReCAPTCHA from 'react-google-recaptcha'
import ContactInformationForm from '@/components/Forms/ContactInformationForm'
import LogoBrand from '@/components/LogoBrand'
import StepsIndicator from '@/components/StepsIndicator'

export default function ContactInfo({
  formData,
  handleChange,
  nextStep,
  prevStep,
  isSubmitting,
  emailFieldError,
  emailInputRef,
  handleBlur,
  setRecaptchaToken,
  recaptchaError,
  setRecaptchaError,
  recaptchaRef,
  RECAPTCHA_SITE_KEY,
  validationErrors = {},
  steps = [],
  currentStep = 2,
  AlertComponent
}) {
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
      <div className="col-lg-6 mb-4 mb-lg-0 p-0 d-none d-lg-block">
        <img src={registerImage} className="w-100 rounded-4" />
      </div>

      <div className="col-lg-6 px-4">
        <LogoBrand className="mb-3" />

        <h5 className="fw-semibold mb-4">Patient Registration</h5>

        <StepsIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-0"
        />

        <h6 className="fw-bold mb-3">CONTACT INFORMATION</h6>

        {/* Alert Component */}
        {AlertComponent && <AlertComponent />}

        <ContactInformationForm
          formData={formData}
          handleChange={handleChange}
          errors={validationErrors}
          isSubmitting={isSubmitting}
          emailFieldError={emailFieldError}
          emailInputRef={emailInputRef}
          handleBlur={handleBlur}
          includeConsent={true}
        />

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

        {(recaptchaError || validationErrors.recaptcha) && (
          <div className="text-danger text-center small mb-2">
            {recaptchaError || validationErrors.recaptcha}
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
