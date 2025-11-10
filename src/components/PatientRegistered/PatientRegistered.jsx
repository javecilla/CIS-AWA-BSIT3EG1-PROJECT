import './PatientRegistered.css';

function PatientRegistered({registeredPatients, verifiedPatients, unverifiedPatients }) {
  return (
    <>
      <div className="patient-container col-12 col-lg-6 d-flex">
        <i class="fa-solid fa-circle-info"></i>
        <div className="card-equal patient-info-card w-100 d-flex flex-column flex-md-row align-items-center gap-3">
          <div className="top-card-text d-flex flex-column justify-content-center align-items-center align-items-md-start">
            <h2 className="top-card-title">
              Patient Registered
            </h2>
            <h2>{registeredPatients || 67}</h2>
            <p className="top-card-description mb-3">Verfified: {verifiedPatients}</p>
            <p className="top-card-description mb-3">Non-verified: {unverifiedPatients}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PatientRegistered;