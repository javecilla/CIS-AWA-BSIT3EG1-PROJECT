import './Profile.css';
import Header from '@/components/Header';
import AccountInformation from '@/components/AccountInformation/AccountInformation';
import PersonalInformation from '@/components/PersonalInformation/PersonalInformation';
import { NavLink } from 'react-router-dom'


function Profile() {
  return (
    <>
      <Header />

      <div className="my-profile-container">
        <div className="my-profile-content-wrapper">
          {/*PROFILE TOP SECTION*/}
          <div className="my-profile-top-section">
            <div className="my-profile-header-text">
              <h2 className="my-profile-title">Your Full Patient Profile</h2>
              <p className="my-profile-subtitle">Use this module to view or update your profile</p>
            </div>
            <button className="btn btn-primary my-profile-back-btn">
              <NavLink to="/p/dashboard" className="my-profile-back-link">
                Back to Dashboard
              </NavLink>
            </button>
          </div>

          <div className="row g-4">
            {/* ACCOUNT INFORMATION*/}
            <div className="col-12 col-lg-5">
              <AccountInformation/>
            </div>

            {/*PROFILE INFORMATION*/}
            <div className="col-12 col-lg-7">
              <PersonalInformation/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;