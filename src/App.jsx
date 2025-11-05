import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, get, child } from 'firebase/database'
import { auth, db } from '@/libs/firebase.js'
import { PATIENT, STAFF } from '@/constants/user-roles'

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
import SendEmail from '@/pages/TestingDemo/SendEmail'
import MockRegister from '@/pages/TestingDemo/MockRegisterFlow'
import MockLogin from '@/pages/TestingDemo/MockLoginFlow'

import { useUser } from '@/context/UserContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, user, role } = useUser()

  if (loading) {
    return (
      <div className="container py-5 d-flex align-items-center min-vh-100 justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === PATIENT) {
      return <Navigate to="/p/dashboard" replace />
    } else if (role === STAFF) {
      return <Navigate to="/s/dashboard" replace />
    }
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const location = useLocation()

  // Hide navbar for login and register pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PATIENT PROTECTED ROUTES */}
        <Route
          path="/p/onboarding/verify-email"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <VerifyEmail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p/onboarding/set-password"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <SetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p/dashboard"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p/my-profile"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p/make-appointment"
          element={
            <ProtectedRoute allowedRoles={[PATIENT]}>
              <PatientMakeAppointment />
            </ProtectedRoute>
          }
        />

        {/* STAFF PROTECTED ROUTES */}
        <Route
          path="/s/dashboard"
          element={
            <ProtectedRoute allowedRoles={[STAFF]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/s/patient/profile"
          element={
            <ProtectedRoute allowedRoles={[STAFF]}>
              <StaffPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/s/patient/register"
          element={
            <ProtectedRoute allowedRoles={[STAFF]}>
              <StaffAppointments />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* TEST ROUTES (Optional: Remove in production) */}
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
        <Route path="/test-demo/send-email" element={<SendEmail />} />
        <Route path="/test-demo/register" element={<MockRegister />} />
        <Route path="/test-demo/login" element={<MockLogin />} />
      </Routes>
    </>
  )
}

export default App
