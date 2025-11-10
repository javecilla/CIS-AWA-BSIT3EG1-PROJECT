import { useState, useEffect } from 'react'
import { ref, get } from 'firebase/database'
import { db, auth } from '@/libs/firebase.js'
import './PatientRegisteredList.css'

function PatientRegisteredList() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(5)

  useEffect(() => {
    fetchAppointments()
  }, [])

  //update filtered results kapad nag search query or appointments change
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

        // Convert object to array and sort by date (newest first)
        const appointmentsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }))

        //sort by (newest first)
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
      //   const status = appointment.st    atus.toLowerCase()
      const reason = getReasonLabel(appointment).toLowerCase()

      return (
        date.toLowerCase().includes(query) ||
        branch.includes(query) ||
        // status.includes(query)
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

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-bg-warning'
      case 'confirmed':
        return 'text-bg-info'
      case 'completed':
        return 'text-bg-success'
      case 'cancelled':
      case 'canceled':
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
    alert('View details for appointment:', appointmentId)
    // TODO: Implement view details modal or navigation
  }

  const handleReschedule = (appointmentId) => {
    alert('Reschedule appointment:', appointmentId)
    // TODO: Implement reschedule functionality
  }

  const handleCancel = (appointmentId) => {
    alert('Cancel appointment:', appointmentId)
    // TODO: Implement cancel functionality
  }

  const handleReBook = (appointmentId) => {
    alert('Re-book appointment:', appointmentId)
    // TODO: Implement re-book functionality
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
          <h3>Patient Registered List</h3>
          <p>Showing all patient appointments for Pandi</p>
        </div>
        <div className="download-records mt-3 mt-md-0">
          <button className="btn btn-primary custom-btn">
            Register Walk-in Patient
          </button>
        </div>
      </div>

      <div className="appointment-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient Name & ID</th>
                <th>Email</th>
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

                      {(appointment.status === 'Pending' ||
                        appointment.status === 'Confirmed') && (
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

                      {(appointment.status === 'Cancelled' ||
                        appointment.status === 'Canceled') && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleReBook(appointment.id)}
                        >
                          Re-Book
                        </button>
                      )}
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
                          No registered patient record found
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
    </>
  )
}

export default PatientRegisteredList
