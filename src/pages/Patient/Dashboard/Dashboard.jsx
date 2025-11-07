import './Dashboard.css'
import Header from '@/components/Header'
import ProfileCard from '@/components/ProfileCard'
import AppointmentHistory from '@/components/AppointmentHistory'
import ConsultationImage from '@/assets/images/consultation.png'
import { useUser } from '@/contexts/UserContext'
import { NavLink } from 'react-router-dom'

function Dashboard() {
  const { userData, loading } = useUser()
  // console.log('User Data in Profile:', userData)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="container">
        <div className="row gx-4 gy-4 align-items-stretch profile-consult-row">
          {/*profile card*/}
          <div className="col-12 col-lg-6 d-flex">
            <div className="card-equal w-100">
              <ProfileCard patientData={userData} />
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
                <NavLink
                  to="/p/make-appointment"
                  className="btn btn-primary custom-btn align-self-center align-self-md-start"
                >
                  Make Appointment
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="appointment-container mt-4">
          <AppointmentHistory />
        </div>
      </div>
    </>
  )
}

export default Dashboard
