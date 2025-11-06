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
