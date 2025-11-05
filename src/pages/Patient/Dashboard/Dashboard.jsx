import './Dashboard.css'
import Header from '@/components/Header'
import ProfileCard from '@/components/ProfileCard'
import AppointmentHistory from '@/components/AppointmentHistory'
import ConsultationImage from '@/assets/images/consultation.png'
import SampleProfile from '@/assets/images/sample-profile.jpg'

function Dashboard() {
  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="main-content-width">
          <div className="row gx-4 gy-4 align-items-stretch profile-consult-row">
            {/*profile card*/}
            <div className="col-12 col-lg-6 d-flex">
              <div className="card-equal w-100">
                <ProfileCard
                  image={SampleProfile}
                  name="User Name"
                  patientId="PAN-10001"
                  mobileNumber="09991118888"
                  email="user@gmail.ocm"
                />
              </div>
            </div>
            {/*consultation card*/}
            <div className="col-12 col-lg-6 d-flex">
              <div className="card-equal consultation-card w-100 d-flex flex-column flex-md-row align-items-center gap-3">
                <div className="flex-shrink-0 d-flex justify-content-center">
                  <img
                    src={ConsultationImage}
                    alt="Doctor at desk"
                    className="img-fluid rounded consultation-image"
                  />
                </div>

                <div className="consultation-text d-flex flex-column justify-content-center align-items-center align-items-md-start">
                  <h2 className="consultation-title">
                    Ready for your <span>CONSULTATION?</span>
                  </h2>
                  <p className="consultation-description mb-3">
                    Provide your incident details to book your first anti-rabies
                    vaccination appointment.
                  </p>
                  <button className="btn btn-primary custom-btn align-self-center align-self-md-start">
                    Make an Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="appointment-container mt-4">
            <AppointmentHistory totalRecords="0" displayedRecords="0" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
