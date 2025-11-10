import './Dashboard.css'
import Header from '@/components/Header'
import TotalAppointments from '@/components/TotalAppointments'
import PatientRegistered from '@/components/PatientRegistered'
import PatientAppointmentList from '@/components/PatientAppointmentList'
import PatientRegisteredList from '@/components/PatientRegisteredList'

function Dashboard() {
  return (
    <>
      <Header />

      <div className="container">
        <div className="row gx-4 gy-4 align-items-stretch profile-consult-row">
          <TotalAppointments />

          <PatientRegistered />
        </div>

        <div className="patient-table-container mt-4">
          <PatientRegisteredList />
        </div>

        <div className="patient-table-container mt-4">
          <PatientAppointmentList />
        </div>
      </div>
    </>
  )
}

export default Dashboard
