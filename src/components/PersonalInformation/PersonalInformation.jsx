import './PersonalInformation.css';

function PersonalInformation({
  firstName,
  lastName,
  middleName,
  suffix,
  birthdate,
  houseNo,
  barangay,
  city,
  province,
  zip,
  mobileNumber,
  emergencyContactName,
  relationshipToPatient,
  emergencyContactMobileNumber
}) {

  function updatePersonal() {
    alert('Personal Information Updated Successfully!');
  }

  return (
    <>
      <div className="personal-info-card">
        {/*PERSONAL INFORMTAION*/}
        <h3 className="section-title">Personal Information</h3>
        {/* First and Last Name*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">First Name:</label>
              <input type="text" className="form-control" defaultValue={firstName}/>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Last Name:</label>
              <input type="text" className="form-control" defaultValue={lastName}/>
            </div>
          </div>
        </div>

        {/* Middle Name and Suffix */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Middle Name:</label>
              <input type="text" className="form-control" defaultValue={middleName}/>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Suffix:</label>
              <input type="text" className="form-control" defaultValue={suffix}/>
            </div>
          </div>
        </div>

        {/*Date of Birth And Sex*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Date of Birth:</label>
              <div className="d-flex align-items-center gap-2">
                <input type="date" className="form-control" defaultValue={birthdate} />
                <span className="age-label">Age: 24</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Sex:</label>
              <select className="form-control">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
        </div>

        {/*House No and Street*/}
        <div className="form-group">
          <label className="form-label">House No. & Street:</label>
          <input type="text" className="form-control" defaultValue={houseNo}/>
        </div>

        {/*Barangay and City*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Barangay:</label>
              <input type="text" className="form-control" defaultValue={barangay} />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">City / Municipality:</label>
              <input type="text" className="form-control" defaultValue={city}/>
            </div>
          </div>
        </div>

        {/*Province & Zip*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Province:</label>
              <input type="text" className="form-control" defaultValue={province}/>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Zip Code:</label>
              <input type="text" className="form-control" defaultValue={zip}/>
            </div>
          </div>
        </div>

        {/*CONTACT INFORMATION*/}
        <h3 className="section-title">Contact Information</h3>
        {/*Mobile Number*/}
        <div className="form-group">
          <label className="form-label">Mobile Number:</label>
          <input type="text" className="form-control" defaultValue={mobileNumber}/>
        </div>

        {/*Emergency Contact Name*/}
        <div className="form-group">
          <label className="form-label">Emergency Contact Name:</label>
          <input type="text" className="form-control" defaultValue={emergencyContactName}/>
        </div>

        {/*Emergency Contact Number*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Relationship to Patient:</label>
              <input type="text" className="form-control" defaultValue={relationshipToPatient}/>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Emergency Contact's Mobile Number:</label>
              <input type="text" className="form-control" defaultValue={emergencyContactMobileNumber}/>
            </div>
          </div>
        </div>
        <button onClick={()=>updatePersonal()} className="btn btn-primary update-account-btn w-100">Update</button>
      </div>
    </>
  );
}

export default PersonalInformation;