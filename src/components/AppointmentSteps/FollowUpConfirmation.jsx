export default function FollowUpConfirmation({ formData, handleRedirect }) {
  return (
    <div className="followup-confirmation appointment-container">
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
          </div>
          {/*Progresss Trcaker*/}
          <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
            <div className="text-center">
              <div className="step-circle completed">1</div>
              <p className="small fw-medium mt-2">
                Select
                <br />
                Reason for Visit
              </p>
            </div>

            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

            <div className="text-center">
              <div className="step-circle completed">2</div>
              <p className="small fw-medium mt-2">Fill Up Form</p>
            </div>

            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />

            <div className="text-center">
              <div className="step-circle active">3</div>
              <p className="small fw-medium mt-2">Finished</p>
            </div>
          </div>
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
      </div>
    </div>
  )
}
