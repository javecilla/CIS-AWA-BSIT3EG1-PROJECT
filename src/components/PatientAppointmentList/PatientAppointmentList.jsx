import { useState, useEffect } from 'react'
import { ref, get, update } from 'firebase/database'
import { db } from '@/libs/firebase.js'
import './PatientAppointmentList.css'
import { formatDateTime } from '@/utils/formatter.js'

function PatientAppointmentList() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState(null)

  const showAlert = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)

    setTimeout(() => {
      setAlertMessage('')
      setAlertType('')
    }, 5000)

    // window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, appointments])

  const fetchAllAppointments = async () => {
    try {
      setLoading(true)

      const appointmentsRef = ref(db, 'appointments')
      const snapshot = await get(appointmentsRef)

      if (snapshot.exists()) {
        const allData = snapshot.val()
        const appointmentsArray = []

        Object.keys(allData).forEach((userId) => {
          const userAppointments = allData[userId]

          Object.keys(userAppointments).forEach((appointmentId) => {
            appointmentsArray.push({
              id: appointmentId,
              userId: userId,
              ...userAppointments[appointmentId]
            })
          })
        })

        const appointmentsWithUserData = await Promise.all(
          appointmentsArray.map(async (appointment) => {
            try {
              const userRef = ref(db, `users/${appointment.userId}`)
              const userSnapshot = await get(userRef)

              if (userSnapshot.exists()) {
                const userData = userSnapshot.val()
                return {
                  ...appointment,
                  patientName: formatFullName(userData.fullName),
                  patientId: userData.patientId || 'N/A',
                  patientEmail: userData.email
                }
              }
              return {
                ...appointment,
                patientName: 'Unknown Patient',
                patientId: 'N/A',
                patientEmail: 'N/A'
              }
            } catch (err) {
              console.error('Error fetching user data:', err)
              return {
                ...appointment,
                patientName: 'Unknown Patient',
                patientId: 'N/A',
                patientEmail: 'N/A'
              }
            }
          })
        )

        appointmentsWithUserData.sort((a, b) => {
          const dateA = new Date(a.createdAt)
          const dateB = new Date(b.createdAt)
          return dateB - dateA
        })

        setAppointments(appointmentsWithUserData)
        setFilteredAppointments(appointmentsWithUserData)
      } else {
        setAppointments([])
        setFilteredAppointments([])
      }
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatFullName = (nameObj) => {
    if (!nameObj) return 'N/A'

    const { firstName, middleName, lastName, suffix } = nameObj
    const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
    return parts.join(' ')
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments)
      setCurrentPage(1)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = appointments.filter((appointment) => {
      // const date = formatDate(appointment.appointmentDate)
      const appointmentId = appointment.appointmentId.toLowerCase()
      const patientName = appointment.patientName.toLowerCase()
      const patientId = appointment.patientId.toLowerCase()
      // const reason = getReasonLabel(appointment).toLowerCase()

      return (
        // date.toLowerCase().includes(query) ||
        appointmentId.includes(query) ||
        patientName.includes(query) ||
        patientId.includes(query)
        // reason.includes(query)
      )
    })

    setFilteredAppointments(filtered)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    }
    return date.toLocaleDateString('en-US', options)
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-bg-warning'
      case 'confirmed':
        return 'text-bg-info'
      case 'completed':
        return 'text-bg-success'
      case 'cancelled':
        return 'text-bg-secondary'
      case 'no-show':
        return 'text-bg-danger'
      default:
        return 'text-bg-light'
    }
  }

  const getReasonLabel = (appointment) => {
    if (appointment.type === 'Incident' && appointment.incidentDetails) {
      return appointment.incidentDetails.primaryReason || 'New Bite Incident'
    } else if (appointment.type === 'FollowUp' && appointment.visitDetails) {
      return appointment.visitDetails.primaryReason || 'Follow-up Visit'
    }
    return 'Consultation'
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredAppointments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )
  const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage)

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

  const handleViewDetails = (appointmentId) => {
    const appointment = appointments.find((a) => a.id === appointmentId)
    if (appointment) {
      setSelectedAppointmentDetails(appointment)
      setShowDetailsModal(true)
    }
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedAppointmentDetails(null)
  }

  const renderExposures = (exposures) => {
    const exposureList = []
    if (exposures.bite) exposureList.push('Bite')
    if (exposures.lick) exposureList.push('Lick')
    if (exposures.scratch) exposureList.push('Scratch')
    if (exposures.abrasion) exposureList.push('Abrasion')
    if (exposures.contamination) exposureList.push('Contamination')
    if (exposures.nibble) exposureList.push('Nibble')

    return exposureList.length > 0 ? exposureList.join(', ') : 'None specified'
  }

  const handleCheckIn = async (appointment) => {
    // console.log(appointment) return
    const confirmed = window.confirm(
      `Check-in ${appointment.patientName} for their appointment?`
    )

    if (!confirmed) return

    try {
      const appointmentRef = ref(
        db,
        `appointments/${appointment.userId}/${appointment.id}`
      )

      await update(appointmentRef, {
        status: 'Confirmed',
        checkedInAt: new Date().toISOString()
      })

      await fetchAllAppointments()
      showAlert('Patient checked in successfully.', 'success')
    } catch (error) {
      console.error('Error checking in:', error)
      showAlert('Failed to check in patient. Please try again.', 'danger')
    }
  }

  const handleMarkAsComplete = async (appointment) => {
    const confirmed = window.confirm(
      `Mark ${appointment.patientName}'s appointment as complete?`
    )

    if (!confirmed) return

    try {
      const appointmentRef = ref(
        db,
        `appointments/${appointment.userId}/${appointment.id}`
      )

      await update(appointmentRef, {
        status: 'Completed',
        completedAt: new Date().toISOString()
      })

      await fetchAllAppointments()
      showAlert('Appointment marked as complete.', 'success')
    } catch (error) {
      console.error('Error marking as complete:', error)
      showAlert(
        'Failed to mark appointment as complete. Please try again.',
        'danger'
      )
    }
  }

  const handleMarkAsNoShow = async (appointment) => {
    const confirmed = window.confirm(
      `Mark ${appointment.patientName}'s appointment as no-show?`
    )

    if (!confirmed) return

    try {
      const appointmentRef = ref(
        db,
        `appointments/${appointment.userId}/${appointment.id}`
      )

      await update(appointmentRef, {
        status: 'No-Show',
        completedAt: new Date().toISOString()
      })

      await fetchAllAppointments()
      showAlert('Appointment marked as no-show.', 'success')
    } catch (error) {
      console.error('Error marking as no-show:', error)
      showAlert(
        'Failed to mark appointment as no-show. Please try again.',
        'danger'
      )
    }
  }

  const handleMarkAsInConsultation = async (appointment) => {
    const confirmed = window.confirm(
      `Mark ${appointment.patientName} as in consultation?`
    )

    if (!confirmed) return

    try {
      const appointmentRef = ref(
        db,
        `appointments/${appointment.userId}/${appointment.id}`
      )

      await update(appointmentRef, {
        status: 'In-Consultation',
        consultationStartedAt: new Date().toISOString()
      })

      await fetchAllAppointments()
      showAlert('Patient consultation started.', 'success')
    } catch (error) {
      console.error('Error marking as in consultation:', error)
      showAlert(
        'Failed to mark as in consultation. Please try again.',
        'danger'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5 d-flex align-items-center min-vh-100 justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
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
      <div className="patient-appointment-list d-flex flex-row justify-content-between flex-wrap">
        <div className="patient-list">
          <h3>Patient Appointment List</h3>
          <p>Showing all patient appointments across all branches</p>
        </div>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, appoinment ID, patient name or ID..."
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

      <div className="patient-appointment-list-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Appointment ID</th>
                <th>Patient Name & ID</th>
                <th>Reason / Type</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((appointment) => (
                  <tr key={`${appointment.userId}-${appointment.id}`}>
                    <td>
                      {formatDate(appointment.appointmentDate)}
                      <br />
                      <small className="text-muted">
                        {appointment.timeSlot}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {appointment.appointmentId}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold">{appointment.patientName}</div>
                      <small className="text-muted">
                        {appointment.patientId}
                      </small>
                    </td>

                    <td>{getReasonLabel(appointment)}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleViewDetails(appointment.id)}
                      >
                        View Details
                      </button>

                      {appointment.status === 'Pending' && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleCheckIn(appointment)}
                        >
                          Check-In
                        </button>
                      )}

                      {appointment.status === 'In-Consultation' && (
                        <>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleMarkAsComplete(appointment)}
                          >
                            Mark as Complete
                          </button>
                        </>
                      )}

                      {appointment.status === 'Confirmed' && (
                        <>
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => handleMarkAsNoShow(appointment)}
                          >
                            Mark as No-Show
                          </button>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleMarkAsInConsultation(appointment)
                            }
                          >
                            Start Consultation
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {searchQuery ? (
                      <>
                        <p className="mb-0">
                          No appointments found matching "{searchQuery}"
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-0">No appointment records found</p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAppointments.length > 0 && (
        <div className="patient-bottom-section d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="record-text text-center text-md-start">
            <p>
              Showing {indexOfFirstRecord + 1} to{' '}
              {Math.min(indexOfLastRecord, filteredAppointments.length)} of{' '}
              {filteredAppointments.length} records
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

      {/* View Details Modal */}
      {showDetailsModal && selectedAppointmentDetails && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title  fw-bold">
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  Appointment Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetailsModal}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {/* General Info */}
                <div className="mb-4">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    General Information
                  </h6>
                  <div className="row g-3 text-sm">
                    <div className="col-md-6">
                      <strong>Appointment ID:</strong>
                      <p className="mb-0 text-muted small">
                        {selectedAppointmentDetails.appointmentId}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Status:</strong>
                      <p className="mb-0">
                        <span
                          className={`badge ${getStatusBadgeClass(
                            selectedAppointmentDetails.status
                          )}`}
                        >
                          {selectedAppointmentDetails.status}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Appointment Date:</strong>
                      <p className="mb-0 text-muted">
                        {formatDate(selectedAppointmentDetails.appointmentDate)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Time Slot:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointmentDetails.timeSlot}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Branch:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointmentDetails.branch}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Appointment Type:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointmentDetails.type === 'Incident'
                          ? 'New Bite Incident'
                          : 'Follow-up Visit'}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Created On:</strong>
                      <p className="mb-0 text-muted">
                        {formatDateTime(selectedAppointmentDetails.createdAt)}
                      </p>
                    </div>
                    {selectedAppointmentDetails.rescheduledAt && (
                      <div className="col-md-6">
                        <strong>Last Rescheduled:</strong>
                        <p className="mb-0 text-muted">
                          {formatDateTime(
                            selectedAppointmentDetails.rescheduledAt
                          )}
                        </p>
                      </div>
                    )}
                    {selectedAppointmentDetails.cancelledAt && (
                      <div className="col-md-6">
                        <strong>Cancelled On:</strong>
                        <p className="mb-0 text-muted">
                          {formatDateTime(
                            selectedAppointmentDetails.cancelledAt
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                {/* Conditional Incident/Follow-up Info */}
                {selectedAppointmentDetails.type === 'Incident' &&
                  selectedAppointmentDetails.incidentDetails && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-danger mb-3">
                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                        Incident Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong>Dose Schedule:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.incidentDetails
                                .primaryReason
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Incident Date:</strong>
                          <p className="mb-0 text-muted">
                            {formatDate(
                              selectedAppointmentDetails.incidentDetails
                                .incidentDate
                            )}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Animal Type:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.incidentDetails
                                .animalType
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Bite Location:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.incidentDetails
                                .biteLocation
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Animal Vaccination Status:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.incidentDetails
                                .animalVaccinationStatus
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Type of Exposure:</strong>
                          <p className="mb-0 text-muted">
                            {renderExposures(
                              selectedAppointmentDetails.incidentDetails
                                .exposures
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className="alert alert-warning mt-3 d-flex align-items-start"
                        role="alert"
                      >
                        <i className="fa-solid fa-info-circle me-2 mt-1"></i>
                        <div>
                          <strong>Important:</strong> Anti-rabies vaccination
                          appointments cannot be rescheduled or cancelled.
                          Please ensure you attend all scheduled doses as
                          prescribed.
                        </div>
                      </div>
                    </div>
                  )}

                {selectedAppointmentDetails.type === 'FollowUp' &&
                  selectedAppointmentDetails.visitDetails && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-info mb-3">
                        <i className="fa-solid fa-stethoscope me-2"></i>
                        Visit Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-12">
                          <strong>Primary Reason for Visit:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.visitDetails
                                .primaryReason
                            }
                          </p>
                        </div>
                        <div className="col-12">
                          <strong>New Conditions or Concerns:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointmentDetails.visitDetails
                                .newConditions
                            }
                          </p>
                        </div>
                        <div className="col-12">
                          <strong>Policy Confirmation:</strong>
                          <p className="mb-0">
                            {selectedAppointmentDetails.visitDetails
                              .confirmPolicy ? (
                              <span className="badge text-bg-success">
                                <i className="fa-solid fa-check me-1"></i>
                                Confirmed
                              </span>
                            ) : (
                              <span className="badge text-bg-secondary">
                                Not Confirmed
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PatientAppointmentList
