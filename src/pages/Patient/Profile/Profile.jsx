import { NavLink } from 'react-router-dom'
import './Profile.css'
import AccountInformation from '@/components/PatientProfile/AccountInformation'
import ImageProfile from '@/components/PatientProfile/ImageProfile'
import PersonalInformation from '@/components/PatientProfile/PersonalInformation'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import { useUser } from '@/contexts/UserContext'

function Profile() {
  const { getPath } = useRoleNavigation()
  const { userData, loading, refreshUserData } = useUser()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
        Unable to load user data. Please try refreshing the page.
      </div>
    )
  }

  return (
    <div className="container my-profile-container">
      <div className="my-profile-content-wrapper">
        {/* PROFILE TOP SECTION */}
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
          {/* ACCOUNT INFORMATION */}
          <div className="col-12 col-lg-4">
            <div className="account-info-card">
              <div>
                <ImageProfile userData={userData} />
              </div>

              <div className="mt-5">
                <AccountInformation accountData={userData} />
              </div>
            </div>
          </div>

          {/* PROFILE INFORMATION */}
          <div className="col-12 col-lg-8">
            <PersonalInformation
              userData={userData}
              refreshUserData={refreshUserData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
