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
              <h5 className="fw-semibold mb-1">Make an Appointment</h5>
              <p className="text-muted small mb-0">
                Use this module to submit an appointment
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
                  Appointment Request Received!
                </h3>
              </div>

              <div className="confirmation-details text-start mb-4">
                <p className="confirmation-message mb-4 text-center">
                  Thank you, <strong>{formData.name || 'Patient'}</strong> ! We
                  have successfully received your request and incident details.
                  Your health is our priority, and our team will review your
                  information shortly. Your appointment id is
                  <strong> {appointmentId}</strong>
                </p>
                <p className="fw-bold mb-2">What Happens Next?</p>
                <ol className="list">
                  <li>
                    Staff Review: Our medical staff will review your submission
                    to prepare you for your visit.
                  </li>
                  <li>
                    Email/SMS Confirmation: You will receive an Email/SMS
                    notification within our clinic hours to confirm your final
                    appointment schedule. Please wait for this message before
                    visiting the clinic.
                  </li>
                </ol>
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
                  Your Consultation has been Booked!
                </h3>
              </div>

              <div className="confirmation-details text-start mb-4">
                <p className="confirmation-message mb-4 text-center">
                  Great! We have booked your appointment. Please see the details
                  below.
                </p>
                <p className="fw-bold mb-2">Appointment Details:</p>
                <ul className="list">
                  <li>Date: {formData.appointmentDate}</li>
                  <li>Time: {formData.timeSlot}</li>
                  <li>Branch: {formData.branch}</li>
                  <li>
                    Reason:{' '}
                    {formData.appointmentReason === 'newBite'
                      ? 'Bite Incident'
                      : formData.primaryReason}
                  </li>
                </ul>

                <p className="reminder-text text-muted mt-3">
                  You will receive an Email/SMS reminder one day before your
                  scheduled visit. You can manage this appointment from your
                  dashboard.
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
