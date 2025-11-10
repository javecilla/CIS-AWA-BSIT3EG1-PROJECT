import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/libs/firebase.js'
import './PatientRegistered.css'

function PatientRegistered() {
  const [counts, setCounts] = useState({
    total: 0,
    male: 0,
    female: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const usersRef = ref(db, 'users')

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const allUsers = Object.values(snapshot.val())

          const patients = allUsers.filter((user) => user.role === 'patient')

          const totalPatients = patients.length

          const stats = patients.reduce(
            (acc, patient) => {
              if (patient.sex === 'Male') {
                acc.male += 1
              } else if (patient.sex === 'Female') {
                acc.female += 1
              }

              return acc
            },
            { male: 0, female: 0 }
          )

          setCounts({
            total: totalPatients,
            male: stats.male,
            female: stats.female
          })
        } else {
          setCounts({ total: 0, male: 0, female: 0 })
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching patient counts: ', error)
        setError('Failed to load stats. Check permissions.')
        setLoading(false)
      }
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
        <p className="top-card-description mb-3"></p>
        <p className="top-card-description mb-3"></p>
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

export default PatientRegistered
