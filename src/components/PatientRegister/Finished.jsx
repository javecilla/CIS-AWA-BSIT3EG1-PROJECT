import registerImage from '@/assets/images/register-step3.1-image.png'
import LogoBrand from '@/components/LogoBrand'
import StepsIndicator from '@/components/StepsIndicator'

export default function Finished({
  handleRedirect,
  patientId,
  userName,
  steps = [],
  currentStep = 3
}) {
  return (
    <div className="row align-items-start">
      <div className="col-lg-6 mb-4 mb-lg-0 p-0 d-none d-lg-block">
        <img src={registerImage} className="w-100 rounded-4" />
      </div>

      <div className="col-lg-6">
        <LogoBrand className="mb-3" />

        <h5 className="fw-semibold my-4 title-text">Patient Registration</h5>

        <StepsIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-4"
        />

        <div className="d-flex jusify-content-center align-items-center flex-column mb-4 px-3 text-center">
          <h4 className="fw-bolder mb-2 fs-2">Account Created Successfully</h4>
          <p className="mb-3 text-middle fw-bold">
            Welcome, <strong>{userName}</strong>! Your secure patient profile is
            now ready.
          </p>

          <div
            className="alert alert-info d-flex align-items-start text-start mb-3"
            role="alert"
          >
            <i className="bi flex-shrink-0 me-2 fa-solid fa-circle-info mt-1"></i>
            <div>
              <strong>Important:</strong> We've sent a verification email to
              your registered email address. Please verify your account before
              logging in. Check your inbox (and spam folder) for the
              verification link.
            </div>
          </div>

          <div
            className="alert alert-warning d-flex align-items-start text-start mb-3"
            role="alert"
          >
            <i className="bi flex-shrink-0 me-2 fa-solid fa-key mt-1"></i>
            <div>
              <strong>Your Login Credentials:</strong>
              <br />
              <strong>Email:</strong> Your registered email
              <br />
              <strong>Password:</strong> Your password follows the format:{' '}
              <code>lastname + MMDDYYYY</code>
              <br />
              <small className="text-muted">
                (e.g., if your last name is "Dela Cruz" and birthday is
                05/15/1990, your password is: delacruz05151990)
              </small>
            </div>
          </div>

          <p className="text-under mt-4 mb-4 fw-medium">
            Your Unique Patient ID is:
            <br />
            <strong className="id-number fs-4 text-primary">{patientId}</strong>
            <br />
            <small className="text-muted">
              Save this ID for future reference.
            </small>
          </p>

          <button
            className="btn btn-primary access-btn fs-4 py-3 px-5"
            onClick={handleRedirect}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  )
}
