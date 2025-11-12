import { NavLink } from 'react-router-dom'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import StepsIndicator from '@/components/StepsIndicator'
import SelectVisitForm from '@/components/Forms/SelectVisitForm'

function SelectReasonVisit({
  formData,
  handleChange,
  onNext,
  steps,
  currentStep,
  AlertComponent,
  showAlert
}) {
  const { getPath } = useRoleNavigation()

  const handleStep1Next = () => {
    if (!formData.appointmentReason) {
      showAlert('Please select a reason for your visit.', 'danger', {
        persist: true
      })
      return
    }

    showAlert('', '')
    if (onNext) {
      onNext()
    }
  }

  return (
    <div className="select-reason appointment-container">
      <div className="row align-items-start">
        <div className="col-lg-12 px-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-semibold mb-1">
                Register as a Walk-in Patient
              </h5>
              <p className="text-muted small mb-0">
                Use this module to register as a walk-in patient
              </p>
            </div>
            <NavLink
              to={getPath('/dashboard')}
              className="btn btn-primary px-4 py-2"
            >
              Back to Dashboard
            </NavLink>
          </div>

          <StepsIndicator
            steps={steps}
            currentStep={currentStep}
            className="mb-5"
          />

          <AlertComponent />

          {/* SELECT REASON FOR VISIT FORM */}
          <SelectVisitForm
            formData={formData}
            handleChange={handleChange}
            onNext={handleStep1Next}
          />
        </div>
      </div>
    </div>
  )
}

export default SelectReasonVisit
