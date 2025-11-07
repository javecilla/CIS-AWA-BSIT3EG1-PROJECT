export default function AppointmentForm({
  formData,
  handleChange,
  nextStep,
  prevStep,
  errors,
  generalError,
  isSubmitting
}) {
  return (
    <div className="appointment-form appointment-container">
      <div className="row align-items-start">
        <div className="col-lg-12 px-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-semibold mb-1">Make an Appointment</h5>
              <p className="text-muted small mb-0">
                Use this module to submit an appointment
              </p>
            </div>
          </div>

          {/*Step Tracker*/}
          <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
            <div className="text-center">
              <div className="step-circle completed">1</div>
              <p className="small fw-medium mt-2">
                Select
                <br />
                Reason for Visit
              </p>
            </div>
            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />
            <div className="text-center">
              <div className="step-circle active">2</div>
              <p className="small fw-medium mt-2">Fill Up Form</p>
            </div>
            <div className="flex-grow-0 mx-3 border-top border-2 step-line" />
            <div className="text-center">
              <div className="step-circle">3</div>
              <p className="small fw-medium mt-2">Finished</p>
            </div>
          </div>

          {/*Appointment Details*/}
          <h6 className="fw-bold mb-3">APPOINTMENT DETAILS</h6>

          {/* General Error Alert */}
          {generalError && (
            <div
              className="alert alert-danger d-flex align-items-center mb-4"
              role="alert"
            >
              <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
              <div>{generalError}</div>
            </div>
          )}

          <div className="mb-4">
            <label className="fw-medium">Select a Branch:</label>
            <small className="text-muted d-block mb-1 text-description">
              Please choose the clinic location you want to visit.
            </small>
            <select
              name="branch"
              className={`form-select mt-1 ${
                errors.branch ? 'is-invalid' : ''
              }`}
              value={formData.branch}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Pandi">Pandi</option>
              <option value="Sta. Maria">Sta. Maria</option>
              <option value="Malolos">Malolos</option>
            </select>
            {errors.branch && (
              <div className="invalid-feedback d-block">{errors.branch}</div>
            )}
          </div>

          {/*Appointment Date n Time*/}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-medium">Preferred Appointment Date:</label>
              <small className="text-muted d-block mb-1 text-description">
                Select a date for your consultation. This will be your Day 0
                vaccination.
              </small>
              <input
                type="date"
                name="appointmentDate"
                className={`form-control mt-1 ${
                  errors.appointmentDate ? 'is-invalid' : ''
                }`}
                value={formData.appointmentDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.appointmentDate && (
                <div className="invalid-feedback d-block">
                  {errors.appointmentDate}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="fw-medium">Preferred Time Slot:</label>
              <small className="text-muted d-block mb-1 text-description">
                Select an available time. Slots are based on clinic hours.
              </small>
              <select
                name="timeSlot"
                className={`form-select mt-1 ${
                  errors.timeSlot ? 'is-invalid' : ''
                }`}
                value={formData.timeSlot}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
                <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
                <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
              </select>
              {errors.timeSlot && (
                <div className="invalid-feedback d-block">
                  {errors.timeSlot}
                </div>
              )}
            </div>
          </div>

          {/*Incident Details*/}
          <h6 className="fw-bold mb-3">INCIDENT DETAILS</h6>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-medium">Date of Incident:</label>
              <small className="text-muted d-block mb-1 text-description">
                CRITICAL: This date will be used as 'Day 0' for the vaccination
                schedule.
              </small>
              <input
                type="date"
                name="incidentDate"
                className={`form-control mt-1 ${
                  errors.incidentDate ? 'is-invalid' : ''
                }`}
                value={formData.incidentDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.incidentDate && (
                <div className="invalid-feedback d-block">
                  {errors.incidentDate}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="fw-medium">Type of Exposure:</label>
              <small className="text-muted d-block mb-1 text-description">
                Please check all that apply.
              </small>
              <div className={`${errors.exposure ? 'is-invalid' : ''}`}>
                <div className="row">
                  {[
                    { name: 'exposureBite', label: 'Bite' },
                    { name: 'exposureLick', label: 'Lick on open wound' },
                    { name: 'exposureScratch', label: 'Scratch' },
                    {
                      name: 'exposureAbrasion',
                      label: 'Abrasions WITHOUT bleeding'
                    },
                    {
                      name: 'exposureContamination',
                      label: 'Contamination of mucous membrane'
                    },
                    {
                      name: 'exposureNibble',
                      label: 'Nibble on uncovered skin'
                    }
                  ].map(({ name, label }) => (
                    <div className="col-md-6" key={name}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name={name}
                          checked={formData[name]}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <label className="form-check-label small">
                          {label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {errors.exposure && (
                <div className="invalid-feedback d-block">
                  {errors.exposure}
                </div>
              )}
            </div>
          </div>

          {/*Animal Details*/}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-medium">Type of Animal:</label>
              <small className="text-muted d-block mb-1 text-description">
                Select the type of animal that bit or scratched the patient.
              </small>
              <input
                list="animalTypes"
                name="animalType"
                className={`form-control mt-1 ${
                  errors.animalType ? 'is-invalid' : ''
                }`}
                placeholder="Select or type animal (e.g., Dog, Cat)"
                value={formData.animalType}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <datalist id="animalTypes">
                <option value="Dog" />
                <option value="Cat" />
              </datalist>
              {errors.animalType && (
                <div className="invalid-feedback d-block">
                  {errors.animalType}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label className="fw-medium">Location of Bite(s) on Body:</label>
              <small className="text-muted d-block mb-1 text-description">
                List all body parts where the patient was bitten or scratched.
              </small>
              <input
                type="text"
                name="biteLocation"
                className={`form-control mt-1 ${
                  errors.biteLocation ? 'is-invalid' : ''
                }`}
                placeholder="e.g., Right hand, Left ankle"
                value={formData.biteLocation}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.biteLocation && (
                <div className="invalid-feedback d-block">
                  {errors.biteLocation}
                </div>
              )}
            </div>
          </div>

          {/*Animal Vaccination Status*/}
          <div className="mb-4">
            <label className="fw-medium">Animal's Vaccination Status:</label>
            <small className="text-muted d-block mb-1 text-description">
              If you are unsure, please select "Unknown".
            </small>
            <select
              name="animalVaccinationStatus"
              className={`form-select mt-1 ${
                errors.animalVaccinationStatus ? 'is-invalid' : ''
              }`}
              value={formData.animalVaccinationStatus}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
              <option value="Unknown">Unknown</option>
            </select>
            {errors.animalVaccinationStatus && (
              <div className="invalid-feedback d-block">
                {errors.animalVaccinationStatus}
              </div>
            )}
          </div>

          {/*Medical History*/}
          <h6 className="fw-bold mb-3">MEDICAL HISTORY</h6>
          <div className="row g-5 mb-4">
            <div className="col-md-6">
              <label className="fw-medium">
                Do you have any known allergies?
              </label>
              <small className="text-muted d-block mb-1 text-description">
                This is important for your safety.
              </small>
              <div
                className={`d-flex gap-4 mt-1 ${
                  errors.hasAllergies ? 'is-invalid' : ''
                }`}
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasAllergies"
                    value="yes"
                    checked={formData.hasAllergies === 'yes'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasAllergies"
                    value="no"
                    checked={formData.hasAllergies === 'no'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              {errors.hasAllergies && (
                <div className="invalid-feedback d-block">
                  {errors.hasAllergies}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="fw-medium">
                Have you received an anti-rabies vaccine before?
              </label>
              <small className="text-muted d-block mb-1 text-description">
                This will help determine if a booster shot is needed.
              </small>
              <div
                className={`d-flex gap-4 mt-1 ${
                  errors.hasReceivedVaccine ? 'is-invalid' : ''
                }`}
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasReceivedVaccine"
                    value="yes"
                    checked={formData.hasReceivedVaccine === 'yes'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasReceivedVaccine"
                    value="no"
                    checked={formData.hasReceivedVaccine === 'no'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              {errors.hasReceivedVaccine && (
                <div className="invalid-feedback d-block">
                  {errors.hasReceivedVaccine}
                </div>
              )}
            </div>
          </div>

          <div className="row g-3 mb-4">
            {/*Allergy*/}
            {formData.hasAllergies === 'yes' && (
              <div className="col-md-6">
                <label className="fw-medium">
                  Please specify your allergies:
                </label>
                <small className="text-muted d-block mb-1 text-description">
                  List all known allergies.
                </small>
                <input
                  type="text"
                  name="allergies"
                  className={`form-control mt-1 ${
                    errors.allergies ? 'is-invalid' : ''
                  }`}
                  placeholder="e.g., Penicillin, seafood"
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.allergies && (
                  <div className="invalid-feedback d-block">
                    {errors.allergies}
                  </div>
                )}
              </div>
            )}

            {/*Vaccine details*/}
            {formData.hasReceivedVaccine === 'yes' && (
              <div className="col-md-6">
                <label className="fw-medium">
                  If yes, when was your last shot?
                </label>
                <small className="text-muted d-block mb-1 text-description">
                  This helps determine if a full course or a booster is
                  required.
                </small>
                <input
                  type="text"
                  name="lastShotDate"
                  className={`form-control mt-1 ${
                    errors.lastShotDate ? 'is-invalid' : ''
                  }`}
                  placeholder="e.g., March 2025"
                  value={formData.lastShotDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.lastShotDate && (
                  <div className="invalid-feedback d-block">
                    {errors.lastShotDate}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-primary px-5 py-2"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              className="btn btn-primary px-5 py-2"
              onClick={nextStep}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
