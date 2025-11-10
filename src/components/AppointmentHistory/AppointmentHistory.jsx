import { useState, useEffect } from 'react'
import { ref, get, update } from 'firebase/database'
import { db, auth } from '@/libs/firebase.js'
import './AppointmentHistory.css'

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(5)

  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({
    branch: '',
    appointmentDate: '',
    timeSlot: ''
  })
  const [rescheduleErrors, setRescheduleErrors] = useState({})
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [rescheduleGeneralError, setRescheduleGeneralError] = useState('')

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
    fetchAppointments()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, appointments])

  const fetchAppointments = async () => {
    const user = auth.currentUser
    if (!user) {
      setError('You must be logged in to view appointments.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const appointmentsRef = ref(db, `appointments/${user.uid}`)
      const snapshot = await get(appointmentsRef)

      if (snapshot.exists()) {
        const data = snapshot.val()

        const appointmentsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }))

        appointmentsArray.sort((a, b) => {
          const dateA = new Date(a.appointmentDate)
          const dateB = new Date(b.appointmentDate)
          return dateB - dateA
        })

        setAppointments(appointmentsArray)
        setFilteredAppointments(appointmentsArray)
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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments)
      setCurrentPage(1)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = appointments.filter((appointment) => {
      const date = formatDate(appointment.appointmentDate)
      const branch = appointment.branch.toLowerCase()
      const reason = getReasonLabel(appointment).toLowerCase()

      return (
        date.toLowerCase().includes(query) ||
        branch.includes(query) ||
        reason.includes(query)
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

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    return date.toLocaleString('en-US', options)
  }

  const getStatusBadgeClass = (status) => {
    switch (status.trim().toLowerCase()) {
      case 'pending':
        return 'text-bg-warning'
      case 'confirmed':
        return 'text-bg-info'
      case 'completed':
        return 'text-bg-success'
      case 'cancelled':
        return 'text-bg-danger'
      default:
        return 'text-bg-secondary'
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
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedAppointment(null)
  }

  const handleReschedule = (appointmentId) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      //pree-fill form with current appointment data
      setRescheduleData({
        branch: appointment.branch,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot
      })
      setRescheduleErrors({})
      setRescheduleGeneralError('')
      setShowRescheduleModal(true)
    }
  }

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false)
    setSelectedAppointment(null)
    setRescheduleData({
      branch: '',
      appointmentDate: '',
      timeSlot: ''
    })
    setRescheduleErrors({})
    setRescheduleGeneralError('')
  }

  const handleRescheduleInputChange = (e) => {
    const { name, value } = e.target
    setRescheduleData((prev) => ({ ...prev, [name]: value }))

    if (rescheduleErrors[name]) {
      setRescheduleErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateRescheduleForm = () => {
    const errors = {}

    if (!rescheduleData.branch) {
      errors.branch = 'Please select a branch.'
    }

    if (!rescheduleData.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required.'
    } else {
      // Validate date is not in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(rescheduleData.appointmentDate)
      if (selectedDate < today) {
        errors.appointmentDate = 'Appointment date cannot be in the past.'
      }
    }

    if (!rescheduleData.timeSlot) {
      errors.timeSlot = 'Please select a time slot.'
    }

    setRescheduleErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRescheduleSubmit = async () => {
    setRescheduleGeneralError('')

    if (!validateRescheduleForm()) {
      setRescheduleGeneralError(
        'Please fix all validation errors before submitting.'
      )
      return
    }

    const user = auth.currentUser
    if (!user) {
      setRescheduleGeneralError(
        'You must be logged in to reschedule appointments.'
      )
      return
    }

    setIsRescheduling(true)

    try {
      const appointmentRef = ref(
        db,
        `appointments/${user.uid}/${selectedAppointment.id}`
      )

      await update(appointmentRef, {
        branch: rescheduleData.branch,
        appointmentDate: rescheduleData.appointmentDate,
        timeSlot: rescheduleData.timeSlot,
        rescheduledAt: new Date().toISOString()
      })

      await fetchAppointments()

      handleCloseRescheduleModal()
      showAlert('Appointment rescheduled successfully.', 'success')
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      setRescheduleGeneralError(
        'Failed to reschedule appointment. Please try again.'
      )
    } finally {
      setIsRescheduling(false)
    }
  }

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment? This action cannot be undone.'
    )

    if (!confirmed) return

    const user = auth.currentUser
    if (!user) {
      showAlert('You must be logged in to cancel appointments.', 'danger')
      return
    }

    try {
      const appointmentRef = ref(
        db,
        `appointments/${user.uid}/${appointmentId}`
      )
      await update(appointmentRef, {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      })

      await fetchAppointments()
      showAlert('Appointment cancelled successfully.', 'success')
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      showAlert('Failed to cancel appointment. Please try again.', 'danger')
    }
  }

  // const handleReBook = (appointmentId) => {
  //   alert(`Re-book appointment: ${appointmentId}`)
  // }

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading appointments...</span>
        </div>
        <p className="mt-3">Loading your appointment history...</p>
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
      <div className="appointment-top-section d-flex flex-row justify-content-between flex-wrap">
        <div className="appointment-history">
          <h3>Your Appointment History</h3>
          <p>Showing all your past and upcoming visits</p>
        </div>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by date, branch, or reason..."
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

      <div className="appointment-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Branch</th>
                <th>Reason / Dose</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {formatDate(appointment.appointmentDate)}{' '}
                      {appointment.timeSlot}
                    </td>
                    <td>{appointment.branch}</td>
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

                      {appointment.type === 'FollowUp' &&
                        appointment.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-outline-secondary btn-sm me-2"
                              onClick={() => handleReschedule(appointment.id)}
                            >
                              Reschedule
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      {/* {appointment.type === 'FollowUp' &&
                        appointment.status === 'Cancelled' && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleReBook(appointment.id)}
                          >
                            Re-Book
                          </button>
                        )} */}
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
                          No appointments found matching "{searchQuery}"
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-calendar-xmark fs-3 text-muted mb-2"></i>
                        <p className="mb-0">
                          No appointment history records found
                        </p>
                        <small className="text-muted">
                          Make your first appointment to get started
                        </small>
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
        <div className="appointment-bottom-section d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="record-text text-center text-md-start">
            <p>
              Showing {indexOfFirstRecord + 1} to{' '}
              {Math.min(indexOfLastRecord, filteredAppointments.length)} of{' '}
              {filteredAppointments.length} records
            </p>
          </div>
          <div className="appointment-button-container d-flex gap-3">
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

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  Appointment Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Common Information */}
                <div className="mb-4">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    General Information
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>Appointment ID:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointment.appointmentId}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Status:</strong>
                      <p className="mb-0">
                        <span
                          className={`badge ${getStatusBadgeClass(
                            selectedAppointment.status
                          )}`}
                        >
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Appointment Date:</strong>
                      <p className="mb-0 text-muted">
                        {formatDate(selectedAppointment.appointmentDate)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Time Slot:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointment.timeSlot}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Branch:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointment.branch}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Appointment Type:</strong>
                      <p className="mb-0 text-muted">
                        {selectedAppointment.type === 'Incident'
                          ? 'New Bite Incident'
                          : 'Follow-up Visit'}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Created On:</strong>
                      <p className="mb-0 text-muted">
                        {formatDateTime(selectedAppointment.createdAt)}
                      </p>
                    </div>
                    {selectedAppointment.rescheduledAt && (
                      <div className="col-md-6">
                        <strong>Last Rescheduled:</strong>
                        <p className="mb-0 text-muted">
                          {formatDateTime(selectedAppointment.rescheduledAt)}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.cancelledAt && (
                      <div className="col-md-6">
                        <strong>Cancelled On:</strong>
                        <p className="mb-0 text-muted">
                          {formatDateTime(selectedAppointment.cancelledAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                {/* Incident Details */}
                {selectedAppointment.type === 'Incident' &&
                  selectedAppointment.incidentDetails && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-danger mb-3">
                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                        Incident Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong>Dose Schedule:</strong>
                          <p className="mb-0 text-muted">
                            {selectedAppointment.incidentDetails.primaryReason}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Incident Date:</strong>
                          <p className="mb-0 text-muted">
                            {formatDate(
                              selectedAppointment.incidentDetails.incidentDate
                            )}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Animal Type:</strong>
                          <p className="mb-0 text-muted">
                            {selectedAppointment.incidentDetails.animalType}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Bite Location:</strong>
                          <p className="mb-0 text-muted">
                            {selectedAppointment.incidentDetails.biteLocation}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Animal Vaccination Status:</strong>
                          <p className="mb-0 text-muted">
                            {
                              selectedAppointment.incidentDetails
                                .animalVaccinationStatus
                            }
                          </p>
                        </div>
                        <div className="col-md-6">
                          <strong>Type of Exposure:</strong>
                          <p className="mb-0 text-muted">
                            {renderExposures(
                              selectedAppointment.incidentDetails.exposures
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

                {/* Follow-up Details */}
                {selectedAppointment.type === 'FollowUp' &&
                  selectedAppointment.visitDetails && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-info mb-3">
                        <i className="fa-solid fa-stethoscope me-2"></i>
                        Visit Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-12">
                          <strong>Primary Reason for Visit:</strong>
                          <p className="mb-0 text-muted">
                            {selectedAppointment.visitDetails.primaryReason}
                          </p>
                        </div>
                        <div className="col-12">
                          <strong>New Conditions or Concerns:</strong>
                          <p className="mb-0 text-muted">
                            {selectedAppointment.visitDetails.newConditions}
                          </p>
                        </div>
                        <div className="col-12">
                          <strong>Policy Confirmation:</strong>
                          <p className="mb-0">
                            {selectedAppointment.visitDetails.confirmPolicy ? (
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
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-calendar-edit me-2"></i>
                  Reschedule Appointment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseRescheduleModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* General Error Alert */}
                {rescheduleGeneralError && (
                  <div
                    className="alert alert-danger d-flex align-items-center mb-3"
                    role="alert"
                  >
                    <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
                    <div>{rescheduleGeneralError}</div>
                  </div>
                )}

                {/* Current Appointment Info */}
                <div className="alert alert-info mb-4" role="alert">
                  <strong>Current Appointment:</strong>
                  <br />
                  {formatDate(selectedAppointment.appointmentDate)} at{' '}
                  {selectedAppointment.timeSlot}
                  <br />
                  Branch: {selectedAppointment.branch}
                </div>

                {/* Branch Selection */}
                <div className="mb-4">
                  <label className="fw-medium">Select a Branch:</label>
                  <small className="text-muted d-block mb-1">
                    Please choose the clinic location you want to visit.
                  </small>
                  <select
                    name="branch"
                    className={`form-select mt-1 ${
                      rescheduleErrors.branch ? 'is-invalid' : ''
                    }`}
                    value={rescheduleData.branch}
                    onChange={handleRescheduleInputChange}
                    disabled={isRescheduling}
                  >
                    <option value="">Select</option>
                    <option value="Pandi">Pandi</option>
                    <option value="Sta. Maria">Sta. Maria</option>
                    <option value="Malolos">Malolos</option>
                  </select>
                  {rescheduleErrors.branch && (
                    <div className="invalid-feedback d-block">
                      {rescheduleErrors.branch}
                    </div>
                  )}
                </div>

                {/* Appointment Date & Time */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="fw-medium">
                      Preferred Appointment Date:
                    </label>
                    <small className="text-muted d-block mb-1">
                      Select a new date for your appointment.
                    </small>
                    <input
                      type="date"
                      name="appointmentDate"
                      className={`form-control mt-1 ${
                        rescheduleErrors.appointmentDate ? 'is-invalid' : ''
                      }`}
                      value={rescheduleData.appointmentDate}
                      onChange={handleRescheduleInputChange}
                      disabled={isRescheduling}
                    />
                    {rescheduleErrors.appointmentDate && (
                      <div className="invalid-feedback d-block">
                        {rescheduleErrors.appointmentDate}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="fw-medium">Preferred Time Slot:</label>
                    <small className="text-muted d-block mb-1">
                      Select an available time. Slots are based on clinic hours.
                    </small>
                    <select
                      name="timeSlot"
                      className={`form-select mt-1 ${
                        rescheduleErrors.timeSlot ? 'is-invalid' : ''
                      }`}
                      value={rescheduleData.timeSlot}
                      onChange={handleRescheduleInputChange}
                      disabled={isRescheduling}
                    >
                      <option value="">Select</option>
                      <option value="7:00 AM - 8:00 AM">
                        7:00 AM - 8:00 AM
                      </option>
                      <option value="8:00 AM - 9:00 AM">
                        8:00 AM - 9:00 AM
                      </option>
                      <option value="9:00 AM - 10:00 AM">
                        9:00 AM - 10:00 AM
                      </option>
                      <option value="10:00 AM - 11:00 AM">
                        10:00 AM - 11:00 AM
                      </option>
                      <option value="11:00 AM - 12:00 PM">
                        11:00 AM - 12:00 PM
                      </option>
                      <option value="1:00 PM - 2:00 PM">
                        1:00 PM - 2:00 PM
                      </option>
                      <option value="2:00 PM - 3:00 PM">
                        2:00 PM - 3:00 PM
                      </option>
                      <option value="3:00 PM - 4:00 PM">
                        3:00 PM - 4:00 PM
                      </option>
                      <option value="4:00 PM - 5:00 PM">
                        4:00 PM - 5:00 PM
                      </option>
                    </select>
                    {rescheduleErrors.timeSlot && (
                      <div className="invalid-feedback d-block">
                        {rescheduleErrors.timeSlot}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseRescheduleModal}
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRescheduleSubmit}
                  disabled={isRescheduling}
                >
                  {isRescheduling ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Rescheduling...
                    </>
                  ) : (
                    'Reschedule Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppointmentHistory
