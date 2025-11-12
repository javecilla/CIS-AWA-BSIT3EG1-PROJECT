import './Dashboard.css'
import AppointmentMetrics from '@/components/WidgetCards/AppointmentMetrics'
import PatientMetrics from '@/components/WidgetCards/PatientMetrics'
import PatientsRegisteredTable from '@/components/Tables/PatientsRegisteredTable'
import AppointmentsRecordTable from '@/components/Tables/AppointmentsRecordTable'

function Dashboard() {
  return (
    <>
      <div className="container">
        <div className="row gx-4 gy-4 align-items-stretch profile-consult-row">
          <AppointmentMetrics />

          <PatientMetrics />
        </div>

        <div className="patient-table-container mt-4">
          <PatientsRegisteredTable />
        </div>

        <div className="appointment-table-container mt-4">
          <AppointmentsRecordTable />
        </div>
      </div>
    </>
  )
}

export default Dashboard
