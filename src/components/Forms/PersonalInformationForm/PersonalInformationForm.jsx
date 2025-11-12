import './PersonalInformationForm.css'

export default function PersonalInformationForm({
  formData,
  handleChange,
  errors = {},
  isSubmitting = false,
  disabled = false
}) {
  return (
    <div className="row g-3">
      <div className={`col-md-6 ${errors.firstName ? 'my-0' : ''}`}>
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
          value={formData.firstName || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.firstName && (
          <div className="invalid-feedback d-block">{errors.firstName}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.lastName ? 'my-0' : ''}`}>
        <label className="fw-medium">Last Name:</label>
        <small className="text-muted d-block mb-1 text-description">
          Please enter patient's last name.
        </small>
        <input
          type="text"
          name="lastName"
          className={`form-control mt-1 ${errors.lastName ? 'is-invalid' : ''}`}
          placeholder="e.g., Doe"
          value={formData.lastName || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.lastName && (
          <div className="invalid-feedback d-block">{errors.lastName}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.middleName ? 'my-0' : ''}`}>
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
          value={formData.middleName || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.middleName && (
          <div className="invalid-feedback d-block">{errors.middleName}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.suffix ? 'my-0' : ''}`}>
        <label className="fw-medium">Suffix:</label>
        <small className="text-muted d-block mb-1 text-description">
          Optional. Leave blank if not applicable.
        </small>
        <input
          type="text"
          name="suffix"
          className={`form-control mt-1 ${errors.suffix ? 'is-invalid' : ''}`}
          placeholder="e.g., Jr., Sr., III"
          value={formData.suffix || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.suffix && (
          <div className="invalid-feedback d-block">{errors.suffix}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.dateOfBirth ? 'my-0' : ''}`}>
        <label className="fw-medium">Date of Birth:</label>
        <small className="text-muted d-block mb-1 text-description">
          Your birthday based on your PSA.
        </small>
        <input
          type="date"
          name="dateOfBirth"
          className={`form-control mt-1 ${
            errors.dateOfBirth ? 'is-invalid' : ''
          }`}
          value={formData.dateOfBirth || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.dateOfBirth && (
          <div className="invalid-feedback d-block">{errors.dateOfBirth}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.sex ? 'my-0' : ''}`}>
        <label className="fw-medium">Sex:</label>
        <small className="text-muted d-block mb-1 text-description">
          Select from the list.
        </small>
        <select
          name="sex"
          className={`form-select mt-1 ${errors.sex ? 'is-invalid' : ''}`}
          value={formData.sex || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        >
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        {errors.sex && (
          <div className="invalid-feedback d-block">{errors.sex}</div>
        )}
      </div>

      <div className={`col-md-12 ${errors.houseNoStreet ? 'my-0' : ''}`}>
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
          value={formData.houseNoStreet || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.houseNoStreet && (
          <div className="invalid-feedback d-block">{errors.houseNoStreet}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.barangay ? 'my-0' : ''}`}>
        <label className="fw-medium">Barangay:</label>
        <small className="text-muted d-block mb-1 text-description">
          Enter the barangay.
        </small>
        <input
          type="text"
          name="barangay"
          className={`form-control mt-1 ${errors.barangay ? 'is-invalid' : ''}`}
          placeholder="e.g., Brgy. 143"
          value={formData.barangay || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.barangay && (
          <div className="invalid-feedback d-block">{errors.barangay}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.cityMunicipality ? 'my-0' : ''}`}>
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
          value={formData.cityMunicipality || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.cityMunicipality && (
          <div className="invalid-feedback d-block">
            {errors.cityMunicipality}
          </div>
        )}
      </div>

      <div className={`col-md-6 ${errors.province ? 'my-0' : ''}`}>
        <label className="fw-medium">Province:</label>
        <small className="text-muted d-block mb-1 text-description">
          Enter the province.
        </small>
        <input
          type="text"
          name="province"
          className={`form-control mt-1 ${errors.province ? 'is-invalid' : ''}`}
          placeholder="e.g., Bulacan"
          value={formData.province || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.province && (
          <div className="invalid-feedback d-block">{errors.province}</div>
        )}
      </div>

      <div className={`col-md-6 ${errors.zipCode ? 'my-0' : ''}`}>
        <label className="fw-medium">Zip Code:</label>
        <small className="text-muted d-block mb-1 text-description">
          Optional. Numbers only.
        </small>
        <input
          type="text"
          name="zipCode"
          className={`form-control mt-1 ${errors.zipCode ? 'is-invalid' : ''}`}
          placeholder="e.g., 3014"
          value={formData.zipCode || ''}
          onChange={handleChange}
          disabled={isSubmitting || disabled}
        />
        {errors.zipCode && (
          <div className="invalid-feedback d-block">{errors.zipCode}</div>
        )}
      </div>
    </div>
  )
}
