import './SelectVisitForm.css'

export default function SelectVisitForm({ formData, handleChange, onNext }) {
  const handleNextClick = () => {
    if (!formData.appointmentReason) {
      return
    }

    if (onNext) {
      onNext()
    }
  }

  return (
    <>
      <h6 className="fw-bold mb-2">Make an Appointment</h6>
      <p className="text-muted mb-4">Please select one to continue.</p>

      <div className="row g-4 mb-4">
        {/* Selection of Reason */}
        <div className="col-12 col-lg-6">
          <div
            className="reason-card p-3"
            onClick={() =>
              handleChange({
                target: { name: 'appointmentReason', value: 'newBite' }
              })
            }
          >
            <div className="d-flex gap-3">
              <input
                type="radio"
                name="appointmentReason"
                value="newBite"
                checked={formData.appointmentReason === 'newBite'}
                onChange={handleChange}
                className="form-check-input mt-1"
              />
              <div>
                <h6 className="fw-bold mb-2">New Bite or Scratch Incident</h6>
                <p className="small text-muted mb-0">
                  Select this if you have a new animal bite or scratch that
                  needs treatment. This will be your Day 0 vaccination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Follow-up */}
        <div className="col-12 col-lg-6">
          <div
            className="reason-card p-3"
            onClick={() =>
              handleChange({
                target: { name: 'appointmentReason', value: 'followUp' }
              })
            }
          >
            <div className="d-flex gap-3">
              <input
                type="radio"
                name="appointmentReason"
                value="followUp"
                checked={formData.appointmentReason === 'followUp'}
                onChange={handleChange}
                className="form-check-input mt-1"
              />
              <div>
                <h6 className="fw-bold mb-2">
                  Follow-up / General Consultation
                </h6>
                <p className="small text-muted mb-0">
                  Select this for a scheduled follow-up, a check-up, or a new
                  concern not related to a bite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-primary px-5 py-2"
          onClick={handleNextClick}
          disabled={!formData.appointmentReason}
        >
          Continue
        </button>
      </div>
    </>
  )
}
