import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams
} from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Loader from '@/components/Loader'
import Login from '@/pages/Login'
import Register from '@/pages/Patient/Register'
import PatientDashboard from '@/pages/Patient/Dashboard'
import PatientProfile from '@/pages/Patient/Profile'
import PatientMakeAppointment from '@/pages/Patient/MakeAppointment'
import StaffDashboard from '@/pages/Staff/Dashboard'
import StaffPatientProfile from '@/pages/Staff/StaffPatientProfile'
import StaffRegisterPatient from '@/pages/Staff/StaffRegisterPatient'
import { PATIENT, STAFF } from '@/constants/user-roles'
import { useUser } from '@/contexts/UserContext'

function App() {
  const location = useLocation()
  const authComponent = ['/auth/login', '/register'].includes(location.pathname)

  return (
    <>
      {!authComponent && (
        <>
          <Navbar />
          <Header />
        </>
      )}

      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/:role/dashboard"
          element={
            <ProtectedRoute allowedRoles={[PATIENT, STAFF]}>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:role/my-profile"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/make-appointment"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <PatientMakeAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:role/patient/:id/profile"
          element={
            <ProtectedRoute allowedRoles={[STAFF]}>
              <StaffPatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/patient/register"
          element={
            <ProtectedRoute allowedRoles={[STAFF]}>
              <StaffRegisterPatient />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </>
  )
}

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, user, role } = useUser()
  const { role: urlRole } = useParams()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/auth/login" replace />

  const expectedRole =
    role === PATIENT ? 'patient' : role === STAFF ? 'staff' : null

  if (urlRole && urlRole !== expectedRole)
    return <Navigate to={`/${expectedRole}/dashboard`} replace />

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === PATIENT) return <Navigate to="/patient/dashboard" replace />
    if (role === STAFF) return <Navigate to="/staff/dashboard" replace />
    return <Navigate to="/auth/login" replace />
  }

  return children
}

function RoleDashboard() {
  const { role } = useUser()

  if (role === PATIENT) return <PatientDashboard />
  if (role === STAFF) return <StaffDashboard />
  return <Navigate to="/auth/login" replace />
}

export default App
