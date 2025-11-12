import StepsIndicator from '@/components/StepsIndicator'
import IncidentForm from '@/components/Forms/IncidentForm'
import ConsultationForm from '@/components/Forms/ConsultationForm'

function FillupVisit({
  formData,
  handleChange,
  onNext,
  onPrev,
  errors,
  isSubmitting,
  steps,
  currentStep,
  AlertComponent
}) {
  return (
    <div className="appointment-form appointment-container">
      <div className="row align-items-start">
        <div className="col-lg-12 px-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-semibold mb-1">Make an Appointment</h5>
              <p className="text-muted small mb-0">
                Use this module to submit an appointment
              </p>
            </div>
          </div>

          <StepsIndicator
            steps={steps}
            currentStep={currentStep}
            className="mb-5"
          />

          <AlertComponent />

          {/* INCIDENT (APPOINTMENT) FORM */}
          {formData.appointmentReason === 'newBite' && (
            <IncidentForm
              formData={formData}
              handleChange={handleChange}
              onNext={onNext}
              onPrev={onPrev}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          )}

          {/* FOLLOW UP FORM */}
          {formData.appointmentReason === 'followUp' && (
            <ConsultationForm
              formData={formData}
              handleChange={handleChange}
              onNext={onNext}
              onPrev={onPrev}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FillupVisit
