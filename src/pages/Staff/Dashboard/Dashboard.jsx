import './Dashboard.css'
import Header from '@/components/Header'
import TotalAppointments from '@/components/TotalAppointments/TotalAppointments'
import PatientRegistered from '@/components/PatientRegistered/PatientRegistered'
import PatientAppointmentList from '@/components/PatientAppointmentList/PatientAppointmentList'
import PatientRegisteredList from '@/components/PatientRegisteredList/PatientRegisteredList'
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
          {/*total appointments*/}
          <TotalAppointments/>

          {/*registered patients*/}
          <PatientRegistered/>
        </div>

        {/*Patient Registered List*/}
        <div className="patient-table-container mt-4">
          <PatientRegisteredList/>
        </div>

        {/*Patient Appointment list*/}
        <div className="patient-table-container mt-4">
          <PatientAppointmentList/>
        </div>
      </div>
      
    </>
  )
}

export default Dashboard
