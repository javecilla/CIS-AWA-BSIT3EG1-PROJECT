import './PatientProfile.css'
import { useParams, NavLink, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '@/libs/firebase'
import { ref, get, child } from 'firebase/database'
import { formatFullName } from '@/utils/formatter'
import Header from '@/components/Header'
import AccountInformation from '@/components/AccountInformation'
import PersonalInformation from '@/components/PersonalInformation'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import UserImageProfile from '@/components/UserImageProfile'
import AppointmentHistory from '@/components/AppointmentHistory'

function PatientProfile() {
  const { id: patientId } = useParams()
  const { getPath } = useRoleNavigation()
  const [searchParams] = useSearchParams()

  const action = searchParams.get('action')
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const userRef = child(ref(db), `users/${patientId}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const data = snapshot.val()
          setPatientData({
            ...data,
            formattedName: formatFullName(data.fullName) || data.email,
            uid: patientId
          })
        } else {
          console.error('No patient data found for UID:', patientId)
          setPatientData(null)
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [patientId])

  // if (patientData) console.log(patientData)

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

  if (!patientData) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
        Unable to load patient data. The user may not exist.
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="container patient-profile-container mb-4">
        <div className="patient-profile-wrapper">
          {/*PROFILE TOP SECTION*/}
          <div className="my-profile-top-section">
            <div className="my-profile-header-text">
              <h2 className="my-profile-title">Your Full Patient Profile</h2>
              <p className="my-profile-subtitle">
                Use this module to view or update your profile
              </p>
            </div>
            <NavLink
              to={getPath('/dashboard')}
              className="btn btn-primary my-profile-back-btn"
            >
              Back to Dashboard
            </NavLink>
          </div>

          <div className="row g-4">
            {/* ACCOUNT INFORMATION*/}
            <div className="col-12 col-lg-5">
              <div className="account-info-card">
                <UserImageProfile userData={patientData} action={action} />
                <br />
                <AccountInformation accountData={patientData} action={action} />
              </div>
            </div>

            {/*PROFILE INFORMATION*/}
            <div className="col-12 col-lg-7">
              <PersonalInformation patientData={patientData} action={action} />
            </div>
          </div>
        </div>
      </div>

      {action === 'view' && (
        <div className="container patient-profile-container mt-4 mb-4">
          <div className="patient-profile-wrapper">
            <AppointmentHistory patientUID={patientId} action="view" />
          </div>
        </div>
      )}
    </>
  )
}

export default PatientProfile
