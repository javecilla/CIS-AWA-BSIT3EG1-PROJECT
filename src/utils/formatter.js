export const formatFullName = (fullNameObject) => {
  if (!fullNameObject) return ''
  const { firstName, middleName, lastName, suffix } = fullNameObject
  const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
  return parts.join(' ')
}

export const maskEmail = (email) => {
  if (!email) return ''
  const [localPart, domain] = email.split('@')
  const maskedLocal =
    localPart.length > 2
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1)
      : localPart[0] + '*'
  return `${maskedLocal}@${domain}`
}

export const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  return phoneNumber.slice(0, -4).replace(/\d/g, '*') + phoneNumber.slice(-4)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }
  return date.toLocaleDateString('en-US', options)
}

export const formatDateTime = (dateTimeString) => {
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
