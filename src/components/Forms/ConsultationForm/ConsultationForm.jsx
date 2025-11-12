import './ConsultationForm.css'

export default function ConsultationForm({
  formData,
  handleChange,
  onNext,
  onPrev,
  errors = {},
  isSubmitting = false
}) {
  return (
    <>
      {/* BOOKING DETAILS */}
      <h6 className="fw-bold mb-3">BOOKING DETAILS</h6>
      {/* Select a Branch */}
      <div className="mb-4">
        <label className="fw-medium">Select a Branch:</label>
        <small className="text-muted d-block mb-1 text-description">
          Please choose the clinic location you want to visit.
        </small>
        <select
          name="branch"
          className={`form-select mt-1 ${errors.branch ? 'is-invalid' : ''}`}
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

      {/* Preferred Appointment Date and Time */}
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
            <div className="invalid-feedback d-block">{errors.timeSlot}</div>
          )}
        </div>
      </div>

      {/* REASON FOR VISIT */}
      <h6 className="fw-bold mb-3">REASON FOR VISIT</h6>

      {/* Primary Reason */}
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
          <div className="invalid-feedback d-block">{errors.primaryReason}</div>
        )}
      </div>

      <div className="dotted-divider"></div>

      {/* New Allergies or Medical Conditions */}
      <div className="mb-4">
        <label className="fw-medium">
          Any new allergies or medical conditions since your last visit?
        </label>
        <small className="text-muted d-block mb-1 text-description">
          It's important to let us know of any changes to your health. If none,
          enter "None".
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
          <div className="invalid-feedback d-block">{errors.newConditions}</div>
        )}
      </div>

      {/* Confirmation Checkbox */}
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
          <div className="invalid-feedback d-block">{errors.confirmPolicy}</div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          type="button"
          className="btn btn-outline-primary px-5 py-2"
          onClick={onPrev}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary px-5 py-2"
          onClick={onNext}
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
    </>
  )
}
