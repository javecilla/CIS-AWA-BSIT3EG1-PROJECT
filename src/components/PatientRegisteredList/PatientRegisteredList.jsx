import { useState, useEffect } from 'react'
import { ref, get, remove } from 'firebase/database'
import { db } from '@/libs/firebase.js'
import './PatientRegisteredList.css'
import { formatFullName } from '@/utils/formatter.js'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'

function PatientRegisteredList() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(5)

  const { navigate } = useRoleNavigation()

  const showAlert = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)

    setTimeout(() => {
      setAlertMessage('')
      setAlertType('')
    }, 5000)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, patients])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const allUsers = Object.keys(data).map((uid) => ({
          uid: uid,
          ...data[uid]
        }))

        const patientList = allUsers.filter((user) => user.role === 'patient')
        // console.log(patientList[0].fullName)
        // console.log(formatFullName(patientList[0].fullName))

        setPatients(patientList)
        setFilteredPatients(patientList)
      } else {
        setPatients([])
        setFilteredPatients([])
      }
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to load patient list. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const query = searchQuery.toLowerCase()
    if (!query) {
      setFilteredPatients(patients)
      setCurrentPage(1)
      return
    }

    const filtered = patients.filter((patient) => {
      const name = formatFullName(patient.fullName).toLowerCase()
      const id = patient.patientId ? patient.patientId.toLowerCase() : ''
      const email = patient.email ? patient.email.toLowerCase() : ''
      const contact = patient.contactInfo?.mobileNumber
        ? patient.contactInfo.mobileNumber
        : ''

      return (
        name.includes(query) ||
        id.includes(query) ||
        email.includes(query) ||
        contact.includes(query)
      )
    })

    setFilteredPatients(filtered)
    setCurrentPage(1)
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredPatients.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )
  const totalPages = Math.ceil(filteredPatients.length / recordsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDelete = async (uid) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this patient record? Deleting this patient will delete all record associated like their appointments. This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      const userRef = ref(db, `users/${uid}`)
      const appointmentsRef = ref(db, `appointments/${uid}`)

      await Promise.all([remove(userRef), remove(appointmentsRef)])

      await fetchPatients()
      showAlert('Patient record deleted successfully.', 'success')
    } catch (error) {
      console.error('Error deleting patient record:', error)
      showAlert('Failed to delete patient record. Please try again.', 'danger')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading patient list...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fa-solid fa-triangle-exclamation me-2"></i>
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="patient-registered-list d-flex flex-row justify-content-between flex-wrap">
        <div className="patient-list">
          <h3>Patient Registered List</h3>
          <p>Showing all registered patient records</p>
        </div>
        <div className="register-walk-in mt-3 mt-md-0">
          <button
            className="btn btn-primary custom-btn"
            onClick={() =>
              alert(
                '//TODO: navigate to /patient/register page and implement functionality'
              )
            }
          >
            Register Walk-in Patient
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, patient ID, email, or contact number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {alertMessage && alertType && (
        <div
          className={`alert alert-${alertType} d-flex align-items-center mb-3`}
          role="alert"
        >
          <i
            className={`fa-solid ${
              alertType === 'success'
                ? 'fa-check-circle'
                : 'fa-triangle-exclamation'
            } bi flex-shrink-0 me-2`}
          ></i>
          <div>{alertMessage}</div>
        </div>
      )}

      <div className="patient-registered-list-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name & ID</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Sex</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((patient) => (
                  <tr key={patient.uid}>
                    <td>
                      <div className="fw-bold">
                        {formatFullName(patient.fullName)}
                      </div>
                      <small className="text-muted">{patient.patientId}</small>
                    </td>
                    <td>{patient.email}</td>
                    <td>{patient.contactInfo?.mobileNumber || 'N/A'}</td>
                    <td>{patient.sex}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() =>
                          navigate(
                            `/patient/${patient.uid}/profile?action=view`
                          )
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() =>
                          navigate(
                            `/patient/${patient.uid}/profile?action=edit`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDelete(patient.uid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {searchQuery ? (
                      <>
                        <i className="fa-solid fa-magnifying-glass fs-3 text-muted mb-2"></i>
                        <p className="mb-0">
                          No patients found matching "{searchQuery}"
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-users fs-3 text-muted mb-2"></i>
                        <p className="mb-0">
                          No registered patient records found.
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length > recordsPerPage && (
        <div className="patient-bottom-section d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="record-text text-center text-md-start">
            <p className="mb-0">
              Showing {indexOfFirstRecord + 1} to{' '}
              {Math.min(indexOfLastRecord, filteredPatients.length)} of{' '}
              {filteredPatients.length} records
            </p>
          </div>
          <div className="patient-button-container d-flex gap-3">
            <button
              className="btn btn-outline-primary custom-btn-outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary custom-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PatientRegisteredList
