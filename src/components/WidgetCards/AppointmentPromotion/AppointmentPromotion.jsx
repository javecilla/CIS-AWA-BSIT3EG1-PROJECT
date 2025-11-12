import { NavLink } from 'react-router-dom'
import './AppointmentPromotion.css'
import ConsultationImage from '@/assets/images/consultation.png'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'

function AppointmentPromotion({ patientData }) {
  const { getPath } = useRoleNavigation()

  return (
    <div className="card-equal consultation-card w-100 d-flex flex-column flex-md-row align-items-center gap-3">
      <div className="flex-shrink-0 d-flex justify-content-center">
        <img
          src={ConsultationImage}
          alt="Doctor at desk"
          className="img-fluid rounded consultation-image"
        />
      </div>

      <div className="consultation-text d-flex flex-column justify-content-center align-items-center align-items-md-start">
        <h2 className="consultation-title">
          Ready for your <span>CONSULTATION?</span>
        </h2>
        <p className="consultation-description mb-3">
          Provide your incident details to book your first anti-rabies
          vaccination appointment.
        </p>
        <NavLink
          to={getPath('/make-appointment')}
          className="btn btn-primary custom-btn align-self-center align-self-md-start"
        >
          Make Appointment
        </NavLink>
      </div>
    </div>
  )
}

export default AppointmentPromotion
