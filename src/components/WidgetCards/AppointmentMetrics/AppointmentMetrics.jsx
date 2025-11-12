import { useState, useEffect } from 'react'
import { subscribeToAppointmentMetrics } from '@/services/staffService'
import './AppointmentMetrics.css'

function AppointmentMetrics() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inConsultation: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleMetricsUpdate = (metrics) => {
      setCounts(metrics)
      setLoading(false)
      setError(null)
    }

    const handleError = (error) => {
      console.error('Error in appointment metrics:', error)
      setError('Failed to load stats. Check permissions.')
      setLoading(false)
    }

    const unsubscribe = subscribeToAppointmentMetrics(
      handleMetricsUpdate,
      handleError
    )

    return () => unsubscribe()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <h2 className="consultation-title">Loading Stats...</h2>
    }

    if (error) {
      return <h2 className="consultation-title text-danger">{error}</h2>
    }

    return (
      <>
        <h2 className="top-card-title">Total Appointments</h2>
        <h2>{counts.total}</h2>
        <p className="top-card-description mb-3">Pending: {counts.pending}</p>
        <p className="top-card-description mb-3">
          Confirmed: {counts.confirmed}
        </p>
        <p className="top-card-description mb-3">
          In-Consultation: {counts.inConsultation}
        </p>
        <p className="top-card-description mb-3">
          Completed: {counts.completed}
        </p>
      </>
    )
  }

  return (
    <>
      <div className="total-appointment-container col-12 col-lg-6 d-flex">
        <i className="fa-solid fa-circle-info"></i>
        <div className="card-equal patient-info-card w-100 d-flex flex-column flex-md-row align-items-center gap-3">
          <div className="top-card-text d-flex flex-column justify-content-center align-items-center align-items-md-start">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default AppointmentMetrics
