import './ProfileCard.css';
import { NavLink } from 'react-router-dom'

function ProfileCard({image, name, patientId, mobileNumber, email}) {
  return (
    <div className="profile-card h-100 d-flex flex-column">
        <div className="profile-header">
            <h2 className="section-title">Your Profile</h2>
            <p className="section-subtitle">Quick patient card information</p>
        </div>
        <div className="profile-row d-flex flex-column flex-md-row align-items-stretch gap-5" role="region" aria-label="profile row">
            {/*left section*/}
            <div className="left-section d-flex flex-column align-items-center align-items-md-start">
                <div className="profile-container">
                    <img src={image} alt="Profile" className="img-fluid rounded profile-image"/>
                </div>

                <div className="left-button-wrap mt-auto w-100 d-flex d-md-block justify-content-center justify-content-md-start">
                    <button className="btn btn-primary custom-btn">
                        <NavLink to="/p/my-profile" className="text-white text-decoration-none">      
                            My Account
                        </NavLink>
                    </button>
                </div>
            </div>

            {/*right section*/}
            <div className="right-section d-flex flex-column justify-content-between">
                <div className="info-block">
                    <p className="profile-name fw-semibold mb-1">{name}</p>
                    <p className="profile-info mb-0">Patient ID: {patientId}</p>
                    <p className="profile-info mb-0">Mobile: {mobileNumber}</p>
                    <p className="profile-email mb-3 text-break">Email: {email}</p>
                </div>

                <div className="right-button-wrap w-100 d-flex d-md-block justify-content-center justify-content-md-start">
                    <button className="btn btn-primary custom-btn">
                        <NavLink to="/p/my-profile" className="text-white text-decoration-none">      
                            View my full Profile
                        </NavLink>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProfileCard;