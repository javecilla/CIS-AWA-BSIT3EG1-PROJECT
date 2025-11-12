//Generate unique patient ID ex: P-20251113-000001
export const generatePatientId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomNum = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `P-${year}${month}${day}-${randomNum}`
}

//Generate password from last name and date of birth ex: lastname + MMDDYYYY (e.g., "doe01151990")
export const generatePassword = (lastName, dateOfBirth) => {
  if (!lastName || !dateOfBirth) return ''

  const parts = dateOfBirth.split('-')
  if (parts.length !== 3) return ''

  const formattedDate = `${parts[1]}${parts[2]}${parts[0]}`
  const cleanLastName = lastName.toLowerCase().replace(/ /g, '')

  return `${cleanLastName}${formattedDate}`
}

//Generate unique appointment ID ex: APT-20251113-0001
export const generateAppointmentId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `APT-${year}${month}${day}-${randomNum}`
}

//Generate unique walk-in patient UID ex: walkin_1731456000_abcdefghi
export const generateWalkinPatientUID = () => {
  return `walkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
