import { NavLink } from 'react-router-dom'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'

export default function SelectReason({
  formData,
  handleChange,
  nextStep,
  generalError
}) {
  const { getPath } = useRoleNavigation()

  return (
    <div className="select-reason appointment-container">
      <div className="row align-items-start">
        <div className="col-lg-12 px-4">
          {/*Top Section*/}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-semibold mb-1">Make an Appointment</h5>
              <p className="text-muted small mb-0">
                Use this module to submit an appointment
              </p>
            </div>
            <NavLink
              to={getPath('/dashboard')}
              className="btn btn-primary px-4 py-2"
            >
              Back to Dashboard
            </NavLink>
          </div>

          {/*Step Tracker*/}
          <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
            <div className="text-center">
              <div className="step-circle active">1</div>
              <p className="small fw-medium mt-2">
                Select
                <br />
                Reason for Visit
              </p>
            </div>

            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

            <div className="text-center">
              <div className="step-circle">2</div>
              <p className="small fw-medium mt-2">Fill Up Form</p>
            </div>

            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

            <div className="text-center">
              <div className="step-circle">3</div>
              <p className="small fw-medium mt-2">Finished</p>
            </div>
          </div>

          <h6 className="fw-bold mb-2">Make an Appointment</h6>
          <p className="text-muted mb-4">Please select one to continue.</p>

          {/* General Error Alert */}
          {generalError && (
            <div
              className="alert alert-danger d-flex align-items-center mb-4"
              role="alert"
            >
              <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
              <div>{generalError}</div>
            </div>
          )}

          <div className="row g-4 mb-4">
            {/*Selection of Reason*/}
            <div className="col-12 col-lg-6">
              <div
                className="reason-card p-3"
                onClick={() =>
                  handleChange({
                    target: { name: 'appointmentReason', value: 'newBite' }
                  })
                }
              >
                <div className="d-flex gap-3">
                  <input
                    type="radio"
                    name="appointmentReason"
                    value="newBite"
                    checked={formData.appointmentReason === 'newBite'}
                    onChange={handleChange}
                    className="form-check-input mt-1"
                  />
                  <div>
                    <h6 className="fw-bold mb-2">
                      New Bite or Scratch Incident
                    </h6>
                    <p className="small text-muted mb-0">
                      Select this if you have a new animal bite or scratch that
                      needs treatment. This will be your Day 0 vaccination.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*Follow-up*/}
            <div className="col-12 col-lg-6">
              <div
                className="reason-card p-3"
                onClick={() =>
                  handleChange({
                    target: { name: 'appointmentReason', value: 'followUp' }
                  })
                }
              >
                <div className="d-flex gap-3">
                  <input
                    type="radio"
                    name="appointmentReason"
                    value="followUp"
                    checked={formData.appointmentReason === 'followUp'}
                    onChange={handleChange}
                    className="form-check-input mt-1"
                  />
                  <div>
                    <h6 className="fw-bold mb-2">
                      Follow-up / General Consultation
                    </h6>
                    <p className="small text-muted mb-0">
                      Select this for a scheduled follow-up, a check-up, or a
                      new concern not related to a bite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-primary px-5 py-2"
              onClick={nextStep}
              disabled={!formData.appointmentReason}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
