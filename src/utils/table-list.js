import { APPOINTMENT_STATUS_BADGES } from '@/constants/appointments'

export const getStatusBadgeClass = (status = '') => {
  const key = String(status).toLowerCase()
  return APPOINTMENT_STATUS_BADGES[key] || 'text-bg-light'
}

export const getReasonLabel = (appointment = {}) => {
  if (appointment.type === 'Incident' && appointment.incidentDetails) {
    return appointment.incidentDetails.primaryReason || 'New Bite Incident'
  }
  if (appointment.type === 'FollowUp' && appointment.visitDetails) {
    return appointment.visitDetails.primaryReason || 'Follow-up Visit'
  }
  return 'Consultation'
}

export const filterAppointmentsByQuery = (
  appointments = [],
  query = '',
  formatDateFn
) => {
  const q = String(query).toLowerCase().trim()
  if (!q) return appointments

  return appointments.filter((appointment) => {
    const date = formatDateFn(appointment.appointmentDate)
    const branch = String(appointment.branch || '').toLowerCase()
    const reason = String(getReasonLabel(appointment)).toLowerCase()
    return (
      String(date).toLowerCase().includes(q) ||
      branch.includes(q) ||
      reason.includes(q)
    )
  })
}

/**
 * Filter appointments by search query and status filter (for appointment table)
 * Searches in appointment ID, patient name, and patient ID
 * @param {Array} appointments - Array of appointment objects
 * @param {string} query - Search query string
 * @param {string} statusFilter - Filter type: 'all', 'no-show', or 'cancelled'
 * @returns {Array} Filtered appointment array
 */
export const filterAppointments = (
  appointments = [],
  query = '',
  statusFilter = 'all'
) => {
  const searchQuery = String(query).toLowerCase().trim()

  return appointments.filter((appointment) => {
    // Filter by status
    if (statusFilter === 'no-show') {
      const status = String(appointment.status || '')
        .toLowerCase()
        .trim()
      // Match both "no show" and "no-show" variations
      if (status !== 'no show' && status !== 'no-show') {
        return false
      }
    } else if (statusFilter === 'cancelled') {
      const status = String(appointment.status || '')
        .toLowerCase()
        .trim()
      if (status !== 'cancelled') {
        return false
      }
    }
    // If statusFilter is 'all', don't filter by status

    // If no search query, return all filtered by status
    if (!searchQuery) {
      return true
    }

    // Search in appointment ID, patient name, and patient ID
    const appointmentId = String(appointment.appointmentId || '').toLowerCase()
    const patientName = String(appointment.patientName || '').toLowerCase()
    const patientId = String(appointment.patientId || '').toLowerCase()

    return (
      appointmentId.includes(searchQuery) ||
      patientName.includes(searchQuery) ||
      patientId.includes(searchQuery)
    )
  })
}

export const paginate = (items = [], page = 1, perPage = 5) => {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const indexOfLastRecord = safePage * perPage
  const indexOfFirstRecord = indexOfLastRecord - perPage
  const currentRecords = items.slice(indexOfFirstRecord, indexOfLastRecord)
  return { currentRecords, totalPages, indexOfFirstRecord, indexOfLastRecord }
}

/**
 * Filter patients by search query and patient type
 * @param {Array} patients - Array of patient objects
 * @param {string} query - Search query string
 * @param {string} patientTypeFilter - Filter type: 'all', 'walkin', or 'online'
 * @param {Function} formatFullName - Function to format patient full name
 * @returns {Array} Filtered patient array
 */
export const filterPatients = (
  patients = [],
  query = '',
  patientTypeFilter = 'all',
  formatFullName
) => {
  const searchQuery = String(query).toLowerCase().trim()

  return patients.filter((patient) => {
    // Filter by patient type
    if (patientTypeFilter === 'walkin' && !patient.uid.startsWith('walkin_')) {
      return false
    }
    if (patientTypeFilter === 'online' && patient.uid.startsWith('walkin_')) {
      return false
    }

    // If no search query, return all filtered by type
    if (!searchQuery) {
      return true
    }

    // Search in name, patient ID, email, and contact number
    const name = formatFullName
      ? formatFullName(patient.fullName).toLowerCase()
      : String(patient.fullName || '').toLowerCase()
    const patientId = String(patient.patientId || '').toLowerCase()
    const email = String(patient.email || '').toLowerCase()
    const contact = String(
      patient.contactInfo?.mobileNumber || ''
    ).toLowerCase()

    return (
      name.includes(searchQuery) ||
      patientId.includes(searchQuery) ||
      email.includes(searchQuery) ||
      contact.includes(searchQuery)
    )
  })
}
