import registerImage from '@/assets/images/register-step1-image.png'
import { NavLink } from 'react-router-dom'
import PersonalInformationForm from '@/components/Forms/PersonalInformationForm'
import LogoBrand from '@/components/LogoBrand'
import StepsIndicator from '@/components/StepsIndicator'

export default function personalInfoStep({
  formData,
  handleChange,
  nextStep,
  validationErrors = {},
  steps = [],
  currentStep = 1,
  AlertComponent
}) {
  return (
    <div className="row align-items-start">
      <div className="col-lg-6 mb-4 mb-lg-0 p-0">
        <img src={registerImage} className="w-100 rounded-4" />
      </div>

      <div className="col-lg-6 px-4">
        <LogoBrand className="mb-3" />

        <h5 className="fw-semibold mb-4">Patient Registration</h5>

        <StepsIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-4"
        />

        <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>

        {/* Alert Component */}
        {AlertComponent && <AlertComponent />}

        <PersonalInformationForm
          formData={formData}
          handleChange={handleChange}
          errors={validationErrors}
        />

        <hr className="my-4 divider" />

        <div className="d-flex justify-content-between align-items-center mt-3">
          <p className="m-0">
            Already have an account? <NavLink to="/auth/login">Login</NavLink>
          </p>

          <button className="btn btn-next px-5 py-2 fs-5" onClick={nextStep}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
