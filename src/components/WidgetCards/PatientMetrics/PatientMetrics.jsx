import { useState, useEffect } from 'react'
import { subscribeToPatientMetrics } from '@/services/staffService'
import './PatientMetrics.css'

function PatientMetrics() {
  const [counts, setCounts] = useState({
    total: 0,
    male: 0,
    female: 0,
    walkIn: 0,
    online: 0
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
      console.error('Error in patient metrics:', error)
      setError('Failed to load stats. Check permissions.')
      setLoading(false)
    }

    const unsubscribe = subscribeToPatientMetrics(
      handleMetricsUpdate,
      handleError
    )

    return () => unsubscribe()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <h2 className="consultation-title">Loading Patients...</h2>
    }

    if (error) {
      return <h2 className="consultation-title text-danger">{error}</h2>
    }

    return (
      <>
        <h2 className="top-card-title">Patient Registered</h2>
        <h2>{counts.total}</h2>
        <p className="top-card-description mb-3">Male: {counts.male}</p>
        <p className="top-card-description mb-3">Female: {counts.female}</p>
        <p className="top-card-description mb-3">Walk-in: {counts.walkIn}</p>
        <p className="top-card-description mb-3">Online: {counts.online}</p>
      </>
    )
  }

  return (
    <>
      <div className="patient-container col-12 col-lg-6 d-flex">
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

export default PatientMetrics
