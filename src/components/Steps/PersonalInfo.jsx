import registerImage from '@/assets/images/register-step1-image.png'
import logoClinic from '@/assets/images/logo-clinic.png'
import { NavLink } from "react-router-dom";

export default function personalInfoStep({ formData, handleChange, nextStep, showErrors}) {
  const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/;
  const zipRegex = /^[0-9]+$/;

    return (
      <div className="row align-items-start">

            <div className="col-lg-6 mb-4 mb-lg-0 p-0">
              <img src={registerImage} className="w-100 rounded-4"/>
            </div>

            <div className="col-lg-6 px-4">

              <div className="d-flex align-items-center mb-3">
                <img src={logoClinic} className="logo-circle me-3" />
                <div>
                  <h4 className="fw-medium mb-0">Animal Bite</h4>
                  <h4 className="fw-bold">CENTER</h4>
                </div>
              </div>

              <h5 className="fw-semibold mb-4">Patient Registration</h5>

              <div className="d-flex justify-content-center align-items-center mb-4 gap-2 mx-4">

                <div className="text-center">
                  <div className="step-circle active">1</div>
                  <p className="small fw-medium mt-2">Personal Information</p>
                </div>

                <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

                <div className="text-center">
                  <div className="step-circle">2</div>
                  <p className="small fw-medium mt-2">Contact Information</p>
                </div>

                <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

                <div className="text-center">
                  <div className="step-circle">3</div>
                  <p className="small fw-medium mt-2">Finished</p>
                </div>

              </div>

              <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>

              <div className="row g-3">

                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    !formData.firstName ||
                    !nameRegex.test(formData.firstName) ||
                    !formData.lastName ||
                    !nameRegex.test(formData.lastName)
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">First Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Please enter patient's first name.
                  </small>

                  <input
                    type="text"
                    name="firstName"
                    className={`form-control mt-1 ${showErrors && (!formData.firstName || !nameRegex.test(formData.firstName)) ? "is-invalid" : ""}`}
                    placeholder="e.g., John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.firstName && (
                    <div className="invalid-feedback d-block">First name is required.</div>
                  )}

                  {showErrors && formData.firstName && !nameRegex.test(formData.firstName) && (
                    <div className="invalid-feedback d-block">Name must not contain numbers.</div>
                  )}
                </div>


                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    !formData.firstName ||
                    !nameRegex.test(formData.firstName) ||
                    !formData.lastName ||
                    !nameRegex.test(formData.lastName)
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">Last Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Please enter patient's last name.
                  </small>

                  <input
                    type="text"
                    name="lastName"
                    className={`form-control mt-1 ${showErrors && (!formData.lastName || !nameRegex.test(formData.lastName)) ? "is-invalid" : ""}`}
                    placeholder="e.g., Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.lastName && (
                    <div className="invalid-feedback d-block">Last name is required.</div>
                  )}

                  {showErrors && formData.lastName && !nameRegex.test(formData.lastName) && (
                    <div className="invalid-feedback d-block">Name must not contain numbers.</div>
                  )}
                </div>


                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    (formData.middleName && !nameRegex.test(formData.middleName)) ||
                    (formData.suffix && !nameRegex.test(formData.suffix))
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">Middle Name:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Leave blank if not applicable.
                  </small>

                  <input
                    type="text"
                    name="middleName"
                    className={`form-control mt-1 ${
                      showErrors &&
                      formData.middleName &&
                      !nameRegex.test(formData.middleName)
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="e.g., Miller"
                    value={formData.middleName}
                    onChange={handleChange}
                  />

                  {showErrors && formData.middleName && !nameRegex.test(formData.middleName) && (
                    <div className="invalid-feedback d-block">
                      Middle name must not contain numbers.
                    </div>
                  )}
                </div>


                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    (formData.middleName && !nameRegex.test(formData.middleName)) ||
                    (formData.suffix && !nameRegex.test(formData.suffix))
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">Suffix:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Leave blank if not applicable.
                  </small>

                  <input
                    type="text"
                    name="suffix"
                    className={`form-control mt-1 ${
                      showErrors &&
                      formData.suffix &&
                      !nameRegex.test(formData.suffix)
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="e.g., Jr., Sr., III"
                    value={formData.suffix}
                    onChange={handleChange}
                  />

                  {showErrors && formData.suffix && !nameRegex.test(formData.suffix) && (
                    <div className="invalid-feedback d-block">
                      Suffix must not contain numbers.
                    </div>
                  )}
                </div>


                <div className={`col-md-6 ${showErrors &&(!formData.dateOfBirth || formData.sex === "" || formData.sex === "Select")? "my-0": ""}`}>
                  <label className="fw-medium">Date of Birth:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    This will automatically calculate the age.
                  </small>
                  <input type="date" name="dateOfBirth" className={`form-control mt-1 ${showErrors && formData.dateOfBirth === "" ? "is-invalid" : ""}`} value={formData.dateOfBirth} onChange={handleChange}/>
                  <div className="invalid-feedback">Date of Birth is required.</div>
                </div>

                <div className={`col-md-6 ${showErrors &&(!formData.dateOfBirth || formData.sex === "" || formData.sex === "Select")? "my-0": ""}`}>
                  <label className="fw-medium">Sex:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Select from the list.
                  </small>
                  <select name="sex" className={`form-control mt-1 ${showErrors && (formData.sex === "" || formData.sex === "Select") ? "is-invalid" : "" }`} value={formData.sex} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <div className="invalid-feedback">Sex is required.</div>
                </div>

                <div className={`col-md-12 ${showErrors && !formData.houseNoStreet ? "my-0" : ""}`}>
                  <label className="fw-medium">House No. & Street:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the patient's street address.
                  </small>
                  <input type="text" name="houseNoStreet" className={`form-control mt-1 ${showErrors && formData.houseNoStreet === "" ? "is-invalid" : ""}`} placeholder="e.g., 123 Main St." value={formData.houseNoStreet} onChange={handleChange}/>
                  <div className="invalid-feedback">House No. & Street is required.</div>
                </div>

                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    !formData.barangay ||
                    !nameRegex.test(formData.barangay) ||
                    !formData.cityMunicipality ||
                    !nameRegex.test(formData.cityMunicipality)
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">Barangay:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the barangay.
                  </small>

                  <input
                    type="text"
                    name="barangay"
                    className={`form-control mt-1 ${showErrors && (!formData.barangay || !nameRegex.test(formData.barangay)) ? "is-invalid" : ""}`}
                    placeholder="e.g., Brgy. 143"
                    value={formData.barangay}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.barangay && (
                    <div className="invalid-feedback d-block">Barangay is required.</div>
                  )}

                  {showErrors && formData.barangay && !nameRegex.test(formData.barangay) && (
                    <div className="invalid-feedback d-block">Barangay must not contain numbers.</div>
                  )}
                </div>


                <div className={`col-md-6 ${
                  showErrors &&
                  (
                    !formData.barangay ||
                    !nameRegex.test(formData.barangay) ||
                    !formData.cityMunicipality ||
                    !nameRegex.test(formData.cityMunicipality)
                  )
                    ? "my-0"
                    : ""
                }`}>
                  <label className="fw-medium">City / Municipality:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the city or municipality.
                  </small>

                  <input
                    type="text"
                    name="cityMunicipality"
                    className={`form-control mt-1 ${showErrors && (!formData.cityMunicipality || !nameRegex.test(formData.cityMunicipality)) ? "is-invalid" : ""}`}
                    placeholder="e.g., Pandi"
                    value={formData.cityMunicipality}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.cityMunicipality && (
                    <div className="invalid-feedback d-block">City / Municipality is required.</div>
                  )}

                  {showErrors && formData.cityMunicipality && !nameRegex.test(formData.cityMunicipality) && (
                    <div className="invalid-feedback d-block">Must not contain numbers.</div>
                  )}
                </div>


                <div className={`col-md-6 ${showErrors && ((!formData.province || !nameRegex.test(formData.province)) ||(formData.zipCode && !zipRegex.test(formData.zipCode))) ? "my-0" : ""}`}>
                  <label className="fw-medium">Province:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Enter the province.
                  </small>

                  <input
                    type="text"
                    name="province"
                    className={`form-control mt-1 ${showErrors && (!formData.province || !nameRegex.test(formData.province)) ? "is-invalid" : ""}`}
                    placeholder="e.g., Bulacan"
                    value={formData.province}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.province && (
                    <div className="invalid-feedback d-block">Province is required.</div>
                  )}

                  {showErrors && formData.province && !nameRegex.test(formData.province) && (
                    <div className="invalid-feedback d-block">Province must not contain numbers.</div>
                  )}
                </div>


                <div className={`col-md-6 ${showErrors && ((!formData.province || !nameRegex.test(formData.province)) ||(formData.zipCode && !zipRegex.test(formData.zipCode))) ? "my-0" : ""}`}>
                  <label className="fw-medium">Zip Code:</label>
                  <small className="text-muted d-block mb-1 text-description">
                    Optional. Numbers only.
                  </small>

                  <input
                    type="text"
                    name="zipCode"
                    className={`form-control mt-1 ${showErrors && (formData.zipCode && !zipRegex.test(formData.zipCode)) ? "is-invalid" : ""}`}
                    placeholder="e.g., 3014"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />

                  {showErrors && formData.zipCode && !zipRegex.test(formData.zipCode) && (
                    <div className="invalid-feedback d-block">Zip code must contain numbers only.</div>
                  )}
                </div>


              </div>

              <hr className="my-4 divider"/>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="m-0">
                  Already have an account? <NavLink to="/login">Login</NavLink>
                </p>

                <button className="btn btn-primary px-5 py-2 fs-5" onClick={nextStep}>Next</button>
              </div>
                            
            </div>

          </div>
    )
  }