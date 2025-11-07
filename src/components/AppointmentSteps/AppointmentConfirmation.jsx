import { NavLink } from "react-router-dom";

export default function AppointmentConfirmation({ formData, handleRedirect }) {
  return (
    <>
      <div className="appointment-container">
        <div className="row align-items-start">
          <div className="col-lg-12 px-4">
            {/*Top Section*/}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h5 className="fw-semibold mb-1">Make an Appointment</h5>
                <p className="text-muted small mb-0">Use this module to submit an appointment</p>
              </div>
              <NavLink to="/dashboard" className="btn btn-primary px-4 py-2">
                Back to Dashboard
              </NavLink>
            </div>
            {/*Progresss Trcaker*/}
            <div className="d-flex justify-content-center align-items-center mb-5 gap-2">

              <div className="text-center">
                <div className="step-circle completed">1</div>
                <p className="small fw-medium mt-2">Select<br/>Reason for Visit</p>
              </div>

              <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

              <div className="text-center">
                <div className="step-circle completed">2</div>
                <p className="small fw-medium mt-2">Fill Up Form</p>
              </div>

              <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

              <div className="text-center">
                <div className="step-circle active">3</div>
                <p className="small fw-medium mt-2">Finished</p>
              </div>

            </div>
            {/*Confirmation*/}
            <div className="text-center my-5">
              <h3 className="confirmation-title fw-bold mb-3">Appointment Request Received!</h3>
            </div>

            <div className="confirmation-details text-start mb-4">
              <p className="confirmation-message mb-4 text-center">
                Thank you, <strong>{formData.name || 'Patient'}</strong>! We have
                successfully received your request and incident details. Your health is
                our priority, and our team will review your information shortly.
              </p>
              <p className="fw-bold mb-2">What Happens Next?</p>
              <ol className="list">
                <li>Staff Review: Our medical staff will review your submission to prepare you for your visit.</li>
                <li>Email/SMS Confirmation: You will receive an Email/SMS notification within our clinic hours to confirm your final appointment schedule. Please wait for this message before visiting the clinic.</li>
              </ol>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-primary px-5 py-2" onClick={handleRedirect}>
                Done
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}