import './Profile.css'
import Header from '@/components/Header'
import AccountInformation from '@/components/AccountInformation'
import PersonalInformation from '@/components/PersonalInformation'
import { NavLink } from 'react-router-dom'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import { useUser } from '@/contexts/UserContext'
import UserImageProfile from '@/components/UserImageProfile'

function Profile() {
  const { getPath } = useRoleNavigation()
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

  if (!userData) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        <i className="bi flex-shrink-0 me-2 fa-solid fa-triangle-exclamation"></i>
        Unable to load user data. Please try refreshing the page.
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="container my-profile-container">
        <div className="my-profile-content-wrapper">
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
                <UserImageProfile userData={userData} />
                <br />
                <AccountInformation accountData={userData} />
              </div>
            </div>

            {/*PROFILE INFORMATION*/}
            <div className="col-12 col-lg-7">
              <PersonalInformation patientData={userData} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
