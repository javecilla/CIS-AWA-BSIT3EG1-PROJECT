import './Dashboard.css'
import ProfileOverview from '@/components/WidgetCards/ProfileOverview'
import AppointmentPromotion from '@/components/WidgetCards/AppointmentPromotion'
import PatientAppointmentTable from '@/components/Tables/PatientAppointmentTable'

import { useUser } from '@/contexts/UserContext'
function Dashboard() {
  const { userData } = useUser()

  return (
    <>
      <div className="container">
        <div className="row gx-4 gy-4 align-items-stretch profile-consult-row">
          <div className="col-12 col-lg-6 d-flex">
            <ProfileOverview patientData={userData} />
          </div>
          {/*consultation card*/}
          <div className="col-12 col-lg-6 d-flex">
            <AppointmentPromotion />
          </div>
        </div>

        <div className="appointment-container mt-4">
          <PatientAppointmentTable />
        </div>
      </div>
    </>
  )
}

export default Dashboard
