import './AccountInformation.css';
import SampleProfile from '@/assets/images/sample-profile.jpg';

function AccountInformation({email, currentPassword, newPassword}) {


  function updateAccount() {
    alert('Account Updated Successfully!');
  }

  return (
    <>
      <div className="account-info-card">
        {/*MyProfile Image*/}
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <img src={SampleProfile} alt="Profile" className="profile-img" />
          </div>
          <div className="profile-upload-controls">
            <input type="file" className="form-control file-select-input" placeholder="Select file" readOnly />
            <button className="btn btn-primary save-file-btn">Save</button>
          </div>
        </div>

        {/*Account Information*/}
        <div className="account-form-section">
          <h3 className="section-title">ACCOUNT INFORMATION</h3>

          {/*Email*/}
          <div className="form-group">
            <label className="form-label">Email / Username:</label>
            <input type="email" className="form-control" defaultValue={email}/>
          </div>

          {/*Current Pass*/}
          <div className="form-group">
            <label className="form-label">Current Password:</label>
            <p className="form-note">Your current password is not displayed here for security purposes.</p>
            <input type="password" className="form-control" defaultValue={currentPassword} />
          </div>

          {/*New Pass*/}
          <div className="form-group">
            <label className="form-label">New Password:</label>
            <input type="password" className="form-control" defaultValue={newPassword} />
          </div>

          <button onClick={()=>updateAccount()} className="btn btn-primary update-account-btn w-100">Update</button>
        </div>
      </div>
    </>
  );
}

export default AccountInformation;