import StepsIndicator from '@/components/StepsIndicator'

function Finished({
  formData,
  appointmentId,
  handleRedirect,
  steps,
  currentStep
}) {
  return (
    <div className="followup-confirmation appointment-container">
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
          </div>

          <StepsIndicator
            steps={steps}
            currentStep={currentStep}
            className="mb-5"
          />

          {/* INCIDENT (APPOINTMENT) CONFIRMATION */}
          {formData.appointmentReason === 'newBite' && (
            // <AppointmentConfirmation
            //   formData={formData}
            //   appointmentId={appointmentId}
            //   handleRedirect={handleRedirect}
            // />
            <div>
              <div className="text-center my-5">
                <h3 className="confirmation-title fw-bold mb-3">
                  Registration Successful!
                </h3>
              </div>

              <div className="confirmation-details text-start mb-4">
                <p className="confirmation-message mb-4 text-center">
                  Patient Successfully Registered. The patient ID is
                  <strong> {appointmentId}</strong> <br />
                  <small className="text-muted">
                    Save this ID for future reference.
                  </small>
                </p>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-primary px-5 py-2"
                  onClick={handleRedirect}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* FOLLOW UP CONFIRMATION */}
          {formData.appointmentReason === 'followUp' && (
            // <FollowUpConfirmation
            //   formData={formData}
            //   appointmentId={appointmentId}
            //   handleRedirect={handleRedirect}
            // />
            <div>
              {/*Confirmation*/}
              <div className="text-center my-5">
                <h3 className="confirmation-title fw-bold mb-3">
                  Registration Successful!
                </h3>
              </div>

              <div className="confirmation-details text-start mb-4">
                <p className="confirmation-message mb-4 text-center">
                  Patient Successfully Registered. The patient ID is
                  <strong> {appointmentId}</strong> <br />
                  <small className="text-muted">
                    Save this ID for future reference.
                  </small>
                </p>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-primary px-5 py-2"
                  onClick={handleRedirect}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Finished
