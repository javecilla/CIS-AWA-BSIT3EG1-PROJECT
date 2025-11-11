import './PatientDetailsForm.css'
import { useState, useEffect } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '@/libs/firebase.js'

function PatientDetailsForm({
  formData,
  handleChange,
  showErrors,
  errors = {},
  generalError,
  emailFieldError,
  emailInputRef,
  onPatientSelect,
  hasPatientRecord: hasPatientRecordProp,
  onHasPatientRecordChange,
  handleBlur
}) {
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [selectedPatientUID, setSelectedPatientUID] = useState('')
  const [searchInput, setSearchInput] = useState('')

  //console.log(`hasPatientRecordProp ${hasPatientRecordProp}`)
  const hasPatientRecord =
    hasPatientRecordProp !== undefined ? hasPatientRecordProp : true

  const handleCheckPatient = (e) => {
    const isChecked = e.target.checked
    const newHasRecord = !isChecked

    if (onHasPatientRecordChange) {
      onHasPatientRecordChange(newHasRecord)
    }

    if (isChecked) {
      setSelectedPatientUID('')
      setSearchInput('')
      if (onPatientSelect) {
        onPatientSelect(null)
      }
    }
  }

  useEffect(() => {
    fetchAllPatients()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const fetchAllPatients = async () => {
    try {
      setLoadingPatients(true)
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)

      if (snapshot.exists()) {
        const usersData = snapshot.val()
        const patientsList = []

        Object.keys(usersData).forEach((uid) => {
          const user = usersData[uid]
          if (user.role === 'patient') {
            patientsList.push({
              uid: uid,
              patientId: user.patientId || 'N/A',
              fullName: formatFullName(user.fullName),
              email: user.email || 'N/A'
            })
          }
        })

        patientsList.sort((a, b) => a.fullName.localeCompare(b.fullName))
        setPatients(patientsList)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoadingPatients(false)
    }
  }

  const formatFullName = (nameObj) => {
    if (!nameObj) return 'N/A'
    const { firstName, middleName, lastName, suffix } = nameObj
    const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
    return parts.join(' ')
  }

  const handlePatientInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)

    const matchedPatient = patients.find(
      (patient) =>
        `${patient.fullName} (${patient.patientId})` === value ||
        patient.patientId === value
    )

    if (matchedPatient) {
      setSelectedPatientUID(matchedPatient.uid)
      if (onPatientSelect) {
        onPatientSelect(matchedPatient.uid)
      }
    } else {
      setSelectedPatientUID('')
      if (onPatientSelect) {
        onPatientSelect(null)
      }
    }
  }

  return (
    <>
      <div className="row mb-5">
        <div className="col-md-12 mb-2">
          <label className="fw-medium">Patient:</label>
          <small className="text-muted d-block mb-1 text-description">
            Please select a patient if the record already exists. Check the
            checkbox if patient has no record to fill up the patient details
            form.
          </small>

          {loadingPatients ? (
            <div className="text-center py-3">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Loading patients...
            </div>
          ) : (
            <>
              <input
                list="patients"
                name="patientSearch"
                id="patientSearch"
                className="form-control mt-1 input-list"
                placeholder="Select or type patient name or ID..."
                disabled={!hasPatientRecord}
                value={searchInput}
                onChange={handlePatientInputChange}
              />
              {errors.patientSearch && showErrors && (
                <div className="text-danger small-text">
                  {errors.patientSearch}
                </div>
              )}
              <datalist id="patients">
                {patients.map((patient) => (
                  <option
                    key={patient.uid}
                    value={`${patient.fullName} (${patient.patientId})`}
                  >
                    {/* {patient.email} */}
                    {`${patient.fullName} (${patient.patientId})`}
                  </option>
                ))}
              </datalist>

              {selectedPatientUID && hasPatientRecord && (
                <div
                  className="alert alert-primary mt-2 d-flex align-items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-check-circle me-2"></i>
                  <div>
                    <strong>Patient Selected:</strong> {searchInput}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-check mt-2">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                name="hasNoPatientRecord"
                checked={!hasPatientRecord}
                onChange={handleCheckPatient}
              />
              No patient record, I will fill up the form.
            </label>
          </div>
        </div>

        {!hasPatientRecord && (
          <>
            <div className="col-lg-6 px-4">
              <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>

              <div className="row g-3">
                {/* First Name */}
                <div className="col-md-6">
                  <label className="fw-medium">First Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Please enter patient's first name.
                  </small>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control mt-1 ${
                      errors.firstName ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback d-block">
                      {errors.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <label className="fw-medium">Last Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Please enter patient's last name.
                  </small>
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control mt-1 ${
                      errors.lastName ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback d-block">
                      {errors.lastName}
                    </div>
                  )}
                </div>

                {/* Middle Name */}
                <div className="col-md-6">
                  <label className="fw-medium">Middle Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Leave blank if not applicable.
                  </small>
                  <input
                    type="text"
                    name="middleName"
                    className={`form-control mt-1 ${
                      errors.middleName ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Miller"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                  {errors.middleName && (
                    <div className="invalid-feedback d-block">
                      {errors.middleName}
                    </div>
                  )}
                </div>

                {/* Suffix */}
                <div className="col-md-6">
                  <label className="fw-medium">Suffix:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Leave blank if not applicable.
                  </small>
                  <input
                    type="text"
                    name="suffix"
                    className={`form-control mt-1 ${
                      errors.suffix ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Jr., Sr., III"
                    value={formData.suffix}
                    onChange={handleChange}
                  />
                  {errors.suffix && (
                    <div className="invalid-feedback d-block">
                      {errors.suffix}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="col-md-6">
                  <label className="fw-medium">Date of Birth:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Patient's birthday based on PSA.
                  </small>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className={`form-control mt-1 ${
                      errors.dateOfBirth ? 'is-invalid' : ''
                    }`}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {errors.dateOfBirth && (
                    <div className="invalid-feedback d-block">
                      {errors.dateOfBirth}
                    </div>
                  )}
                </div>

                {/* Sex */}
                <div className="col-md-6">
                  <label className="fw-medium">Sex:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Select from the list.
                  </small>
                  <select
                    name="sex"
                    className={`form-select mt-1 ${
                      errors.sex ? 'is-invalid' : ''
                    }`}
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.sex && (
                    <div className="invalid-feedback d-block">{errors.sex}</div>
                  )}
                </div>

                {/* House No & Street */}
                <div className="col-md-12">
                  <label className="fw-medium">House No. & Street:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the patient's street address.
                  </small>
                  <input
                    type="text"
                    name="houseNoStreet"
                    className={`form-control mt-1 ${
                      errors.houseNoStreet ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., 123 Main St."
                    value={formData.houseNoStreet}
                    onChange={handleChange}
                  />
                  {errors.houseNoStreet && (
                    <div className="invalid-feedback d-block">
                      {errors.houseNoStreet}
                    </div>
                  )}
                </div>

                {/* Barangay */}
                <div className="col-md-6">
                  <label className="fw-medium">Barangay:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the barangay.
                  </small>
                  <input
                    type="text"
                    name="barangay"
                    className={`form-control mt-1 ${
                      errors.barangay ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Brgy. 143"
                    value={formData.barangay}
                    onChange={handleChange}
                  />
                  {errors.barangay && (
                    <div className="invalid-feedback d-block">
                      {errors.barangay}
                    </div>
                  )}
                </div>

                {/* City / Municipality */}
                <div className="col-md-6">
                  <label className="fw-medium">City / Municipality:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the city or municipality.
                  </small>
                  <input
                    type="text"
                    name="cityMunicipality"
                    className={`form-control mt-1 ${
                      errors.cityMunicipality ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Pandi"
                    value={formData.cityMunicipality}
                    onChange={handleChange}
                  />
                  {errors.cityMunicipality && (
                    <div className="invalid-feedback d-block">
                      {errors.cityMunicipality}
                    </div>
                  )}
                </div>

                {/* Province */}
                <div className="col-md-6">
                  <label className="fw-medium">Province:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the province.
                  </small>
                  <input
                    type="text"
                    name="province"
                    className={`form-control mt-1 ${
                      errors.province ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Bulacan"
                    value={formData.province}
                    onChange={handleChange}
                  />
                  {errors.province && (
                    <div className="invalid-feedback d-block">
                      {errors.province}
                    </div>
                  )}
                </div>

                {/* Zip Code */}
                <div className="col-md-6">
                  <label className="fw-medium">Zip Code:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Must be exactly 4 digits.
                  </small>
                  <input
                    type="text"
                    name="zipCode"
                    className={`form-control mt-1 ${
                      errors.zipCode ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., 3014"
                    maxLength="4"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                  {errors.zipCode && (
                    <div className="invalid-feedback d-block">
                      {errors.zipCode}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 px-4">
              <h6 className="fw-bold mb-3">CONTACT INFORMATION</h6>

              <div className="row g-3">
                {/* Mobile Number */}
                <div className="col-md-12">
                  <label className="fw-medium">Mobile Number:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Used for sending critical SMS reminders. Must start with 09
                    or +639.
                  </small>
                  <input
                    type="text"
                    name="mobileNumber"
                    className={`form-control mt-1 ${
                      errors.mobileNumber ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., 09*******22"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                  {errors.mobileNumber && (
                    <div className="invalid-feedback d-block">
                      {errors.mobileNumber}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="col-md-12">
                  <label className="fw-medium">Email Address:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Digital copies will be sent here and serve as username in
                    portal.
                  </small>
                  <input
                    ref={emailInputRef}
                    type="email"
                    name="emailAddress"
                    className={`form-control mt-1 ${
                      errors.emailAddress || emailFieldError ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., john.doe@example.net"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {(errors.emailAddress || emailFieldError) && (
                    <div className="invalid-feedback d-block">
                      {emailFieldError || errors.emailAddress}
                    </div>
                  )}
                </div>

                {/* Emergency Contact Name */}
                <div className="col-md-12">
                  <label className="fw-medium">Emergency Contact Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Who should we call in an emergency?
                  </small>
                  <input
                    type="text"
                    name="emergencyContactName"
                    className={`form-control mt-1 ${
                      errors.emergencyContactName ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Jane Smith"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                  {errors.emergencyContactName && (
                    <div className="invalid-feedback d-block">
                      {errors.emergencyContactName}
                    </div>
                  )}
                </div>

                {/* Emergency Contact Relationship */}
                <div className="col-md-6">
                  <label className="fw-medium">Relationship to Patient:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    What is their relationship to the patient?
                  </small>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    className={`form-control mt-1 ${
                      errors.emergencyContactRelationship ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., Spouse, Mother, Sibling"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                  />
                  {errors.emergencyContactRelationship && (
                    <div className="invalid-feedback d-block">
                      {errors.emergencyContactRelationship}
                    </div>
                  )}
                </div>

                {/* Emergency Contact Mobile */}
                <div className="col-md-6">
                  <label className="fw-medium">
                    Emergency Contact's Mobile Number:
                  </label>
                  <small className="text-muted d-block mb-1 text-description">
                    Must start with 09 or +639.
                  </small>
                  <input
                    type="text"
                    name="emergencyContactNumber"
                    className={`form-control mt-1 ${
                      errors.emergencyContactNumber ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g., 09*******88"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                  />
                  {errors.emergencyContactNumber && (
                    <div className="invalid-feedback d-block">
                      {errors.emergencyContactNumber}
                    </div>
                  )}
                </div>

                {/* Review & Consent */}
                <div className="col-md-12 mt-4">
                  <h6 className="fw-bold mb-2">REVIEW & CONSENT</h6>
                  <p className="fw-medium mb-2 text-description">
                    Data Privacy and Communication Consent
                  </p>
                  <p className="mb-3 text-description">
                    Please review and check the following boxes to complete
                    registration.
                  </p>

                  <div className="form-check mb-2">
                    <input
                      className={`form-check-input ${
                        errors.hasReviewed ? 'is-invalid' : ''
                      }`}
                      type="checkbox"
                      name="hasReviewed"
                      checked={formData.hasReviewed || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      I have reviewed all the information and confirm that it is
                      accurate.
                    </label>
                    {errors.hasReviewed && (
                      <div className="invalid-feedback d-block">
                        {errors.hasReviewed}
                      </div>
                    )}
                  </div>

                  <div className="form-check mb-2">
                    <input
                      className={`form-check-input ${
                        errors.hasConsent ? 'is-invalid' : ''
                      }`}
                      type="checkbox"
                      name="hasConsent"
                      checked={formData.hasConsent || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      I consent to the collection and processing of personal
                      data for treatment purposes, in accordance with the Data
                      Privacy Act of 2012.
                    </label>
                    {errors.hasConsent && (
                      <div className="invalid-feedback d-block">
                        {errors.hasConsent}
                      </div>
                    )}
                  </div>

                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors.hasAgreed ? 'is-invalid' : ''
                      }`}
                      type="checkbox"
                      name="hasAgreed"
                      checked={formData.hasAgreed || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      I agree to receive SMS and email reminders for
                      appointments and vaccination schedule.
                    </label>
                    {errors.hasAgreed && (
                      <div className="invalid-feedback d-block">
                        {errors.hasAgreed}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PatientDetailsForm
