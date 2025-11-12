export const DEFAULT_RECORDS_PER_PAGE = 5

// appointment status values (actual status values stored in the database)
export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_CONSULTATION: 'In-Consultation',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show'
}

// appointment status badges (bootstrap classes)
export const APPOINTMENT_STATUS_BADGES = {
  pending: 'text-bg-warning',
  confirmed: 'text-bg-info',
  'in-consultation': 'text-bg-info',
  completed: 'text-bg-success',
  cancelled: 'text-bg-secondary',
  'no-show': 'text-bg-danger',
  //gagiii hahahahaha
  'no show': 'text-bg-danger'
}

// appointment status labels (display names)
export const APPOINTMENT_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-consultation': 'In Consultation',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No Show'
}
