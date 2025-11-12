import { useState, useEffect } from 'react'
import { subscribeToAllPatients, deletePatient } from '@/services/staffService'
import { filterPatients, paginate } from '@/utils/table-list'
import { formatFullName } from '@/utils/formatter'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import Alert from '@/components/Alert'
import { NavLink } from 'react-router-dom'
import './PatientsRegisteredTable.css'

function PatientsRegisteredTable() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [patientTypeFilter, setPatientTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(5)

  const { navigate, getPath } = useRoleNavigation()
  const { AlertComponent, showAlert } = Alert()

  useEffect(() => {
    const handlePatientsUpdate = (patientsData) => {
      setPatients(patientsData)
      setLoading(false)
      setError('')
    }

    const handleError = (error) => {
      console.error('Error in patients subscription:', error)
      setError('Failed to load patient list. Check permissions.')
      setLoading(false)
    }

    setLoading(true)
    setError('')

    const unsubscribe = subscribeToAllPatients(
      handlePatientsUpdate,
      handleError
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, patientTypeFilter])

  const handleDelete = async (uid) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this patient record? Deleting this patient will delete all record associated like their appointments. This action cannot be undone.'
    )

    if (!confirmed) return

    const result = await deletePatient(uid)

    if (result.success) {
      // Use service message if available, otherwise use default
      showAlert(
        result.message || 'Patient record deleted successfully.',
        'success'
      )
    } else {
      showAlert(result.error.message, 'danger', { persist: true })
    }
  }

  // Filter patients based on search query and type filter
  const filteredPatients = filterPatients(
    patients,
    searchQuery,
    patientTypeFilter,
    formatFullName
  )

  // Paginate filtered results
  const { currentRecords, totalPages, indexOfFirstRecord, indexOfLastRecord } =
    paginate(filteredPatients, currentPage, recordsPerPage)

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
          <NavLink
            className="btn btn-primary custom-btn"
            to={getPath('/patient/register')}
          >
            Register Walk-in Patient
          </NavLink>
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
        <span className="d-flex flex-wrap gap-2 align-items-center">
          <div
            className="btn-group"
            role="group"
            aria-label="Patient type filter"
          >
            <button
              type="button"
              className={`btn btn-outline-primary ${
                patientTypeFilter === 'all' ? 'active' : ''
              }`}
              onClick={() => setPatientTypeFilter('all')}
            >
              <i className="fa-solid fa-users me-1"></i>All Patients
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                patientTypeFilter === 'walkin' ? 'active' : ''
              }`}
              onClick={() => setPatientTypeFilter('walkin')}
            >
              <i className="fa-solid fa-person-walking me-1"></i>Walk-in
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                patientTypeFilter === 'online' ? 'active' : ''
              }`}
              onClick={() => setPatientTypeFilter('online')}
            >
              <i className="fa-solid fa-globe me-1"></i>Online
            </button>
          </div>
        </span>
      </div>

      <AlertComponent />

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
                      <div className="mt-1">
                        <span
                          className={`badge ${
                            patient.uid.startsWith('walkin_')
                              ? 'bg-warning text-dark'
                              : 'bg-info'
                          }`}
                        >
                          {patient.uid.startsWith('walkin_')
                            ? 'Walk-in'
                            : 'Online'}
                        </span>
                      </div>
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

export default PatientsRegisteredTable
