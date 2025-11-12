import { useState, useEffect } from 'react'
import { useParams, NavLink, useSearchParams } from 'react-router-dom'
import { formatFullName } from '@/utils/formatter'
import { getUserData } from '@/services/authService'
import { isWalkInPatient } from '@/services/staffService'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import AccountInformation from '@/components/PatientProfile/AccountInformation'
import ImageProfile from '@/components/PatientProfile/ImageProfile'
import PersonalInformation from '@/components/PatientProfile/PersonalInformation'
import PatientAppointmentTable from '@/components/Tables/PatientAppointmentTable/PatientAppointmentTable'
import { PATIENT } from '@/constants/user-roles'
import './StaffPatientProfile.css'

function StaffPatientProfile() {
  const { id: patientId } = useParams()
  const [searchParams] = useSearchParams()
  const { getPath } = useRoleNavigation()
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const action = searchParams.get('action') || 'view'

  //check if patient is a walk-in patient (no Firebase Auth account)
  const isWalkIn = patientId ? isWalkInPatient(patientId) : false

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setLoading(false)
        setError('No patient ID provided.')
        return
      }

      setLoading(true)
      setError('')

      try {
        const result = await getUserData(patientId)

        if (result.success && result.data) {
          const data = result.data
          // verify this is a patient
          if (data.role !== PATIENT) {
            setError('The selected user is not a patient.')
            setPatientData(null)
          } else {
            setPatientData({
              ...data,
              formattedName: formatFullName(data.fullName) || data.email,
              uid: patientId
            })
          }
        } else {
          setError(
            result.error?.message ||
              'Unable to load patient data. The user may not exist.'
          )
          setPatientData(null)
        }
      } catch (err) {
        console.error('Error fetching patient data:', err)
        setError('Failed to load patient data. Please try again.')
        setPatientData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [patientId])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !patientData) {
    return (
      <div className="container my-profile-container">
        <div className="alert alert-warning m-4" role="alert">
          <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
          {error ||
            'Unable to load patient data. Please try refreshing the page.'}
        </div>
        <NavLink to={getPath('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </NavLink>
      </div>
    )
  }

  return (
    <>
      <div className="container my-profile-container mb-4">
        <div className="my-profile-content-wrapper">
          {/* PROFILE TOP SECTION */}
          <div className="my-profile-top-section">
            <div className="my-profile-header-text">
              <h2 className="my-profile-title">Patient Profile</h2>
              <p className="my-profile-subtitle">
                View patient information and appointment history
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
            {/* ACCOUNT INFORMATION */}
            <div className="col-12 col-lg-4">
              <div className="account-info-card">
                <div>
                  <ImageProfile userData={patientData} action={action} />
                </div>

                <div className="mt-5">
                  {isWalkIn ? (
                    <div className="account-form-section">
                      <div className="alert alert-info" role="alert">
                        <i className="fa-solid fa-info-circle me-2"></i>
                        <div>
                          <strong>Walk-in Patient</strong>
                          <p className="mb-0 mt-2">
                            This patient was registered as a walk-in and does
                            not have an online account. Account management
                            features (password changes) are not available for
                            walk-in patients.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <AccountInformation
                      accountData={patientData}
                      action={action}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* PROFILE INFORMATION */}
            <div className="col-12 col-lg-8">
              <PersonalInformation
                userData={patientData}
                refreshUserData={() => {
                  // Refetch patient data when needed
                  const refetch = async () => {
                    const result = await getUserData(patientId)
                    if (result.success && result.data) {
                      const data = result.data
                      setPatientData({
                        ...data,
                        formattedName:
                          formatFullName(data.fullName) || data.email,
                        uid: patientId
                      })
                    }
                  }
                  refetch()
                }}
                action={action}
              />
            </div>
          </div>
        </div>
      </div>

      {/* APPOINTMENT HISTORY - Only show when action is 'view' */}
      {action === 'view' && (
        <div className="container my-profile-container mt-2 mb-5">
          <div className="appointment-history-container">
            <PatientAppointmentTable patientUID={patientId} action="view" />
          </div>
        </div>
      )}
    </>
  )
}

export default StaffPatientProfile
