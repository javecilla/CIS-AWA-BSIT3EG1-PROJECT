import { NavLink } from 'react-router-dom'
import PatientDetailsForm from '@/components/PatientDetailsForm'
import { useUser } from '@/contexts/UserContext'
import { STAFF } from '@/constants/user-roles'

export default function FollowUpForm({
  formData,
  handleChange,
  nextStep,
  prevStep,
  errors,
  generalError,
  isSubmitting,
  selectedPatientUID,
  hasPatientRecord,
  onPatientSelect,
  onHasPatientRecordChange,
  handleBlur,
  emailFieldError,
  emailInputRef,
  showErrors
}) {
  const { role } = useUser()
  return (
    <div className="followup-form appointment-container">
      <div className="row align-items-start">
        <div className="col-lg-12 px-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-semibold mb-1">Make an Appointment</h5>
              <p className="text-muted small mb-0">
                Use this module to submit an appointment
              </p>
            </div>
            <NavLink to="/dashboard" className="btn btn-primary px-4 py-2">
              Back to Dashboard
            </NavLink>
          </div>

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

          {/*Patient Details*/}
          {role === STAFF && (
            <>
              <h6 className="fw-bold mb-3">PATIENT DETAILS</h6>
              <PatientDetailsForm
                formData={formData}
                handleChange={handleChange}
                showErrors={showErrors}
                errors={errors} // Pass field-specific errors
                generalError={generalError}
                emailFieldError={emailFieldError}
                emailInputRef={emailInputRef}
                onPatientSelect={onPatientSelect}
                hasPatientRecord={hasPatientRecord}
                onHasPatientRecordChange={onHasPatientRecordChange}
                handleBlur={handleBlur}
              />
            </>
          )}

          {/*BOOKING DETAILS*/}
          <h6 className="fw-bold mb-3">BOOKING DETAILS</h6>
          {/*Select a Branch*/}
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

          {/*Preferred Appointment Date and Time*/}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-medium">Preferred Appointment Date:</label>
              <small className="text-muted d-block mb-1 text-description">
                Select a date for your consultation.
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

          {/*REASON FOR VISIT*/}
          <h6 className="fw-bold mb-3">REASON FOR VISIT</h6>

          {/*Primary Reason*/}
          <div className="mb-4">
            <label className="fw-medium">Primary Reason for this Visit:</label>
            <small className="text-muted d-block mb-1 text-description">
              Providing a brief reason helps our staff prepare for your visit.
            </small>
            <textarea
              name="primaryReason"
              className={`form-control mt-1 ${
                errors.primaryReason ? 'is-invalid' : ''
              }`}
              rows="3"
              placeholder="e.g., Follow-up for my Day 7 shot, Wound check-up, General health concern"
              value={formData.primaryReason}
              onChange={handleChange}
              disabled={isSubmitting}
            ></textarea>
            {errors.primaryReason && (
              <div className="invalid-feedback d-block">
                {errors.primaryReason}
              </div>
            )}
          </div>

          <div className="dotted-divider"></div>

          {/*New Allergies or Medical Conditions*/}
          <div className="mb-4">
            <label className="fw-medium">
              Any new allergies or medical conditions since your last visit?
            </label>
            <small className="text-muted d-block mb-1 text-description">
              It's important to let us know of any changes to your health. If
              none, enter "None".
            </small>
            <textarea
              name="newConditions"
              className={`form-control mt-1 ${
                errors.newConditions ? 'is-invalid' : ''
              }`}
              rows="3"
              placeholder="List any new allergies or medical conditions (or enter 'None')."
              value={formData.newConditions}
              onChange={handleChange}
              disabled={isSubmitting}
            ></textarea>
            {errors.newConditions && (
              <div className="invalid-feedback d-block">
                {errors.newConditions}
              </div>
            )}
          </div>

          {/*Confirmation Checkbox*/}
          <div className="form-check mb-4">
            <input
              className={`form-check-input ${
                errors.confirmPolicy ? 'is-invalid' : ''
              }`}
              type="checkbox"
              name="confirmPolicy"
              checked={!!formData.confirmPolicy}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label className="form-check-label">
              I confirm the details above and agree to the clinic's appointment
              policy.
            </label>
            {errors.confirmPolicy && (
              <div className="invalid-feedback d-block">
                {errors.confirmPolicy}
              </div>
            )}
          </div>

          {/*Navigation Buttons*/}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-outline-primary px-5 py-2"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="button"
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
