import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/libs/firebase.js'
import './TotalAppointments.css'

function TotalAppointments() {
  const [counts, setCounts] = useState({
    total: 0,
    checkedIn: 0,
    completed: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments')

    const unsubscribe = onValue(
      appointmentsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const allUsersData = snapshot.val()

          const allAppointmentsArray = Object.values(allUsersData).flatMap(
            (userAppointments) => Object.values(userAppointments)
          )

          const total = allAppointmentsArray.filter(
            (appt) => appt.status?.toLowerCase() !== 'cancelled'
          ).length

          const statusCounts = allAppointmentsArray.reduce(
            (acc, appt) => {
              const status = appt.status ? appt.status.toLowerCase() : ''

              if (status === 'checked-in' || status === 'confirmed') {
                acc.checkedIn += 1
              } else if (status === 'completed') {
                acc.completed += 1
              } else if (status === 'pending') {
                acc.pending += 1
              } else if (status === 'cancelled') {
                acc.cancelled += 1
              }
              return acc
            },
            { checkedIn: 0, completed: 0, pending: 0, cancelled: 0 }
          )

          setCounts({ total, ...statusCounts })
        } else {
          setCounts({
            total: 0,
            checkedIn: 0,
            completed: 0,
            pending: 0,
            cancelled: 0
          })
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching all appointments: ', error)
        setError('Failed to load stats. Check permissions.')
        setLoading(false)
      }
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
          Checked-in: {counts.checkedIn}
        </p>
        <p className="top-card-description mb-3">
          Completed: {counts.completed}
        </p>
        <p className="top-card-description mb-3">
          Cancelled: {counts.cancelled}
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

export default TotalAppointments
