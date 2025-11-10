import { useState } from 'react'
import { ref, set, update } from 'firebase/database'
import { db } from '@/libs/firebase.js'
import { calculateAge } from '@/utils/calculator'
import './PersonalInformation.css'
import { useUser } from '@/contexts/UserContext'

function PersonalInformation({ patientData, action = 'edit' }) {
  const { refreshUserData } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/
  const phoneRegex = /^(09|\+639)\d{9}$/
  const zipRegex = /^[0-9]+$/

  const [formData, setFormData] = useState({
    firstName: patientData.fullName.firstName || '',
    lastName: patientData.fullName.lastName || '',
    middleName: patientData.fullName.middleName || '',
    suffix: patientData.fullName.suffix || '',
    dateOfBirth: patientData.dateOfBirth || '',
    sex: patientData.sex || 'Male',
    houseNoStreet: patientData.address.houseNoStreet || '',
    barangay: patientData.address.barangay || '',
    cityMunicipality: patientData.address.cityMunicipality || '',
    province: patientData.address.province || '',
    zipCode: patientData.address.zipCode || '',
    mobileNumber: patientData.contactInfo.mobileNumber || '',
    emergencyContactName: patientData.emergencyContact.name || '',
    emergencyContactRelationship:
      patientData.emergencyContact.relationship || '',
    emergencyContactMobile: patientData.emergencyContact.mobileNumber || ''
  })

  const isEditing = action === 'edit' ? true : false

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const errors = {}

    // First Name - Required and must match name pattern
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.'
    } else if (!nameRegex.test(formData.firstName)) {
      errors.firstName = 'Name must not contain numbers or special characters.'
    }

    // Last Name - Required and must match name pattern
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = 'Name must not contain numbers or special characters.'
    }

    // Middle Name - Optional but must match pattern if provided
    if (formData.middleName && !nameRegex.test(formData.middleName)) {
      errors.middleName =
        'Middle name must not contain numbers or special characters.'
    }

    // Suffix - Optional but must match pattern if provided
    if (formData.suffix && !nameRegex.test(formData.suffix)) {
      errors.suffix = 'Suffix must not contain numbers or special characters.'
    }

    // Date of Birth - Required and cannot be future date
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required.'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      if (birthDate > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future.'
      }
    }

    // Sex - Required
    if (!formData.sex || formData.sex === 'Select') {
      errors.sex = 'Sex is required.'
    }

    // House No & Street - Required
    if (!formData.houseNoStreet.trim()) {
      errors.houseNoStreet = 'House No. & Street is required.'
    }

    // Barangay - Required
    if (!formData.barangay.trim()) {
      errors.barangay = 'Barangay is required.'
    }

    // City/Municipality - Required and must match name pattern
    if (!formData.cityMunicipality.trim()) {
      errors.cityMunicipality = 'City/Municipality is required.'
    } else if (!nameRegex.test(formData.cityMunicipality)) {
      errors.cityMunicipality = 'City/Municipality must not contain numbers.'
    }

    // Province - Required and must match name pattern
    if (!formData.province.trim()) {
      errors.province = 'Province is required.'
    } else if (!nameRegex.test(formData.province)) {
      errors.province = 'Province must not contain numbers.'
    }

    // Zip Code - Optional but must be numbers only if provided
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      errors.zipCode = 'Zip code must contain numbers only.'
    }

    // Mobile Number - Required and must match PH format
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required.'
    } else if (!phoneRegex.test(formData.mobileNumber)) {
      errors.mobileNumber =
        'Invalid PH mobile number format. Must start with 09 or +639 and have 11 digits.'
    }

    // Emergency Contact Name - Required and must match name pattern
    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required.'
    } else if (!nameRegex.test(formData.emergencyContactName)) {
      errors.emergencyContactName =
        'Name must not contain numbers or special characters.'
    }

    // Emergency Contact Relationship - Required and must match name pattern
    if (!formData.emergencyContactRelationship.trim()) {
      errors.emergencyContactRelationship = 'Relationship is required.'
    } else if (!nameRegex.test(formData.emergencyContactRelationship)) {
      errors.emergencyContactRelationship =
        'Relationship must not contain numbers.'
    }

    // Emergency Contact Mobile - Required and must match PH format
    if (!formData.emergencyContactMobile.trim()) {
      errors.emergencyContactMobile =
        'Emergency contact mobile number is required.'
    } else if (!phoneRegex.test(formData.emergencyContactMobile)) {
      errors.emergencyContactMobile =
        'Invalid PH mobile number format. Must start with 09 or +639 and have 11 digits.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setGeneralError('')
    setSuccessMessage('')

    if (!validateForm()) {
      setGeneralError('Please fix all validation errors before submitting.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      const updateData = {
        fullName: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          middleName: formData.middleName.trim(),
          suffix: formData.suffix.trim()
        },
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
        address: {
          houseNoStreet: formData.houseNoStreet.trim(),
          barangay: formData.barangay.trim(),
          cityMunicipality: formData.cityMunicipality.trim(),
          province: formData.province.trim(),
          zipCode: formData.zipCode.trim()
        },
        contactInfo: {
          mobileNumber: formData.mobileNumber.trim(),
          emailAddress: patientData.email //keep existing email
        },
        emergencyContact: {
          name: formData.emergencyContactName.trim(),
          relationship: formData.emergencyContactRelationship.trim(),
          mobileNumber: formData.emergencyContactMobile.trim()
        },
        updatedAt: new Date().toISOString()
      }

      const userRef = ref(db, `users/${patientData.uid}`)
      // await set(userRef, updateData)
      await update(userRef, updateData)

      setSuccessMessage('Profile updated successfully!')

      await refreshUserData()

      window.scrollTo({ top: 0, behavior: 'smooth' })

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error) {
      console.error('Update error:', error)
      setGeneralError(
        'Something went wrong on our end, please try again later.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="personal-info-card">
      <form onSubmit={handleUpdate} className="personal-info-form" noValidate>
        {/*PERSONAL INFORMATION*/}
        <h3 className="section-title">PERSONAL INFORMATION</h3>

        {/* Success Message */}
        {successMessage && (
          <div
            className="alert alert-success d-flex align-items-center"
            role="alert"
          >
            <i className="fa-solid fa-circle-check bi flex-shrink-0 me-2"></i>
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error Message */}
        {generalError && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
            <div>{generalError}</div>
          </div>
        )}

        {/* First and Last Name*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">First Name:</label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${
                  validationErrors.firstName ? 'is-invalid' : ''
                }`}
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g., John"
                readOnly={!isEditing}
              />
              {validationErrors.firstName && (
                <div className="invalid-feedback">
                  {validationErrors.firstName}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Last Name:</label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${
                  validationErrors.lastName ? 'is-invalid' : ''
                }`}
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g., Doe"
                readOnly={!isEditing}
              />
              {validationErrors.lastName && (
                <div className="invalid-feedback">
                  {validationErrors.lastName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Name and Suffix */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Middle Name:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Optional. Leave blank if not applicable.
              </small>
              <input
                type="text"
                name="middleName"
                className={`form-control ${
                  validationErrors.middleName ? 'is-invalid' : ''
                }`}
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="e.g., Miller"
                readOnly={!isEditing}
              />
              {validationErrors.middleName && (
                <div className="invalid-feedback">
                  {validationErrors.middleName}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Suffix:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Optional. Leave blank if not applicable.
              </small>
              <input
                type="text"
                name="suffix"
                className={`form-control ${
                  validationErrors.suffix ? 'is-invalid' : ''
                }`}
                value={formData.suffix}
                onChange={handleInputChange}
                placeholder="e.g., Jr., Sr., III"
                readOnly={!isEditing}
              />
              {validationErrors.suffix && (
                <div className="invalid-feedback">
                  {validationErrors.suffix}
                </div>
              )}
            </div>
          </div>
        </div>

        {/*Date of Birth And Sex*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Date of Birth:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Your birthday based on your PSA.
              </small>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  name="dateOfBirth"
                  className={`form-control ${
                    validationErrors.dateOfBirth ? 'is-invalid' : ''
                  }`}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
                <span className="age-label">
                  Age:{' '}
                  {formData.dateOfBirth
                    ? calculateAge(formData.dateOfBirth)
                    : 0}
                </span>
              </div>
              {validationErrors.dateOfBirth && (
                <div className="invalid-feedback d-block">
                  {validationErrors.dateOfBirth}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Sex:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Select from the list.
              </small>
              <select
                name="sex"
                className={`form-${isEditing ? 'select' : 'control'} ${
                  validationErrors.sex ? 'is-invalid' : ''
                }`}
                value={formData.sex}
                onChange={handleInputChange}
                readOnly={!isEditing}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {validationErrors.sex && (
                <div className="invalid-feedback">{validationErrors.sex}</div>
              )}
            </div>
          </div>
        </div>

        {/*House No and Street*/}
        <div className="form-group">
          <label className="form-label">House No. & Street:</label>
          <small
            className={`text-muted d-block mb-1 ${
              action === 'view' && 'd-none'
            }`}
          >
            Enter the patient's street address.
          </small>
          <input
            type="text"
            name="houseNoStreet"
            className={`form-control ${
              validationErrors.houseNoStreet ? 'is-invalid' : ''
            }`}
            value={formData.houseNoStreet}
            onChange={handleInputChange}
            placeholder="e.g., 123 Main St."
            readOnly={!isEditing}
          />
          {validationErrors.houseNoStreet && (
            <div className="invalid-feedback">
              {validationErrors.houseNoStreet}
            </div>
          )}
        </div>

        {/*Barangay and City*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Barangay:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Enter the barangay.
              </small>
              <input
                type="text"
                name="barangay"
                className={`form-control ${
                  validationErrors.barangay ? 'is-invalid' : ''
                }`}
                value={formData.barangay}
                onChange={handleInputChange}
                placeholder="e.g., Brgy. 143"
                readOnly={!isEditing}
              />
              {validationErrors.barangay && (
                <div className="invalid-feedback">
                  {validationErrors.barangay}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">City / Municipality:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Enter the city or municipality.
              </small>
              <input
                type="text"
                name="cityMunicipality"
                className={`form-control ${
                  validationErrors.cityMunicipality ? 'is-invalid' : ''
                }`}
                value={formData.cityMunicipality}
                onChange={handleInputChange}
                placeholder="e.g., Pandi"
                readOnly={!isEditing}
              />
              {validationErrors.cityMunicipality && (
                <div className="invalid-feedback">
                  {validationErrors.cityMunicipality}
                </div>
              )}
            </div>
          </div>
        </div>

        {/*Province & Zip*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Province:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Enter the province.
              </small>
              <input
                type="text"
                name="province"
                className={`form-control ${
                  validationErrors.province ? 'is-invalid' : ''
                }`}
                value={formData.province}
                onChange={handleInputChange}
                placeholder="e.g., Bulacan"
                readOnly={!isEditing}
              />
              {validationErrors.province && (
                <div className="invalid-feedback">
                  {validationErrors.province}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Zip Code:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Optional. Numbers only.
              </small>
              <input
                type="text"
                name="zipCode"
                className={`form-control ${
                  validationErrors.zipCode ? 'is-invalid' : ''
                }`}
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="e.g., 3014"
                readOnly={!isEditing}
              />
              {validationErrors.zipCode && (
                <div className="invalid-feedback">
                  {validationErrors.zipCode}
                </div>
              )}
            </div>
          </div>
        </div>

        <br />
        {/*CONTACT INFORMATION*/}
        <h3 className="section-title">CONTACT INFORMATION</h3>

        {/*Mobile Number*/}
        <div className="form-group">
          <label className="form-label">Mobile Number:</label>
          <small
            className={`text-muted d-block mb-1 ${
              action === 'view' && 'd-none'
            }`}
          >
            Used for sending critical SMS reminders. Must start with 09 or +639.
          </small>
          <input
            type="text"
            name="mobileNumber"
            className={`form-control ${
              validationErrors.mobileNumber ? 'is-invalid' : ''
            }`}
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="e.g., 09*******22"
            readOnly={!isEditing}
          />
          {validationErrors.mobileNumber && (
            <div className="invalid-feedback">
              {validationErrors.mobileNumber}
            </div>
          )}
        </div>

        {/*Emergency Contact Name*/}
        <div className="form-group">
          <label className="form-label">Emergency Contact Name:</label>
          <small
            className={`text-muted d-block mb-1 ${
              action === 'view' && 'd-none'
            }`}
          >
            Who should we call in an emergency?
          </small>
          <input
            type="text"
            name="emergencyContactName"
            className={`form-control ${
              validationErrors.emergencyContactName ? 'is-invalid' : ''
            }`}
            value={formData.emergencyContactName}
            onChange={handleInputChange}
            placeholder="e.g., Jane Smith"
            readOnly={!isEditing}
          />
          {validationErrors.emergencyContactName && (
            <div className="invalid-feedback">
              {validationErrors.emergencyContactName}
            </div>
          )}
        </div>

        {/*Emergency Contact Relationship and Number*/}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">Relationship to Patient:</label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                What is their relationship to the patient?
              </small>
              <input
                type="text"
                name="emergencyContactRelationship"
                className={`form-control ${
                  validationErrors.emergencyContactRelationship
                    ? 'is-invalid'
                    : ''
                }`}
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange}
                placeholder="e.g., Spouse, Mother, Sibling"
                readOnly={!isEditing}
              />
              {validationErrors.emergencyContactRelationship && (
                <div className="invalid-feedback">
                  {validationErrors.emergencyContactRelationship}
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="form-label">
                Emergency Contact's Mobile Number:
              </label>
              <small
                className={`text-muted d-block mb-1 ${
                  action === 'view' && 'd-none'
                }`}
              >
                Must start with 09 or +639.
              </small>
              <input
                type="text"
                name="emergencyContactMobile"
                className={`form-control ${
                  validationErrors.emergencyContactMobile ? 'is-invalid' : ''
                }`}
                value={formData.emergencyContactMobile}
                onChange={handleInputChange}
                placeholder="e.g., 09*******88"
                readOnly={!isEditing}
              />
              {validationErrors.emergencyContactMobile && (
                <div className="invalid-feedback">
                  {validationErrors.emergencyContactMobile}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            className="btn btn-primary update-account-btn w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              'Update Information'
            )}
          </button>
        )}
      </form>
    </div>
  )
}

export default PersonalInformation
