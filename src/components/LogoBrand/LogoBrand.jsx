import logoClinic from '@/assets/images/logo-clinic.png'
import './LogoBrand.css'

export default function LogoBrand({ className = '' }) {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <img
        src={logoClinic}
        className="logo-circle me-3"
        alt="Clinic Logo"
        loading="eager"
        fetchPriority="high"
      />
      <div>
        <h4 className="fw-medium mb-0">Animal Bite</h4>
        <h4 className="fw-bold">CENTER</h4>
      </div>
    </div>
  )
}
