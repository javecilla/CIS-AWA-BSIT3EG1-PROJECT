import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Login from '@/pages/Login'
import Register from '@/pages/Patient/Register'
import SetPassword from '@/pages/Patient/Onboarding/SetPassword'
import VerifyEmail from '@/pages/Patient/Onboarding/VerifyEmail'
import PatientDashboard from '@/pages/Patient/Dashboard'
import PatientProfile from '@/pages/Patient/Profile'
import PatientMakeAppointment from '@/pages/Patient/MakeAppointment'
import StaffPatients from '@/pages/Staff/PatientProfile'
import StaffAppointments from '@/pages/Staff/RegisterPatient'
import StaffDashboard from '@/pages/Staff/Dashboard'

import TestFirebaseDatabase from '@/pages/TestingDemo/FirbaseDatabase'
import TestFirebaseStorage from '@/pages/TestingDemo/FirebaseStorage'
import TestFirebaseAuthentication from '@/pages/TestingDemo/FirebaseAuthentication'
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PRIVATE ROUTES (currently not secured para mabilis mag design)*/}

        {/* PATIENT ROUTES RELATED */}
        <Route path="/p/onboarding/verify-email" element={<VerifyEmail />} />
        <Route path="/p/onboarding/set-password" element={<SetPassword />} />

        <Route path="/p/dashboard" element={<PatientDashboard />} />
        <Route path="/p/my-profile" element={<PatientProfile />} />
        <Route
          path="/p/make-appointment"
          element={<PatientMakeAppointment />}
        />

        {/* STAFF ROUTES RELATED */}
        <Route path="/s/dashboard" element={<StaffDashboard />} />
        <Route path="/s/patient/profile" element={<StaffPatients />} />
        <Route path="/s/patient/register" element={<StaffAppointments />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* TEST ROUTES */}
        <Route
          path="/test-demo/firebase-database"
          element={<TestFirebaseDatabase />}
        />
        <Route
          path="/test-demo/firebase-storage"
          element={<TestFirebaseStorage />}
        />
        <Route
          path="/test-demo/firebase-authentication"
          element={<TestFirebaseAuthentication />}
        />
      </Routes>
    </>
  )
}

export default App
