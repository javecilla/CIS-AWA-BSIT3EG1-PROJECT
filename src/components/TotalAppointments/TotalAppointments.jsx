import './TotalAppointments.css';

function TotalAppointments({ totalAppointment, checkedIn, completed, pending }) {

  return (
    <>
      <div className="total-appointment-container col-12 col-lg-6 d-flex">
        <i class="fa-solid fa-circle-info"></i>
        <div className="card-equal consultation-card w-100 d-flex flex-column flex-md-row align-items-center gap-3">
          <div className="consultation-text d-flex flex-column justify-content-center align-items-center align-items-md-start">
            <h2 className="consultation-title">
              Total Appointments
            </h2>
            <h2>{totalAppointment || 35}</h2>
            <p className="consultation-description mb-3">Checked-in: {checkedIn}</p>
            <p className="consultation-description mb-3">Completed: {completed}</p>
            <p className="consultation-description mb-3">Pending: {pending}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default TotalAppointments;