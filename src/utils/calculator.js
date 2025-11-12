export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}

export const calculateNextDose = (incidentDate, currentDate = new Date()) => {
  const incident = new Date(incidentDate)
  const daysDiff = Math.floor((currentDate - incident) / (1000 * 60 * 60 * 24))

  // Rabies vaccination schedule: (Day 0, Day 3, Day 7, Day 14, Day 28)

  //if daysDiff is 0, return Dose 1 (Day 0)
  if (daysDiff === 0) return 'Dose 1 (Day 0)'
  //if daysDiff is greater than or equal to 1 and less than 3, return Dose 1 (Day 0) - Late
  if (daysDiff >= 1 && daysDiff < 3) return 'Dose 1 (Day 0) - Late'
  //if daysDiff is greater than or equal to 3 and less than 7, return Dose 2 (Day 3)
  if (daysDiff >= 3 && daysDiff < 7) return 'Dose 2 (Day 3)'
  //if daysDiff is greater than or equal to 7 and less than 14, return Dose 3 (Day 7)
  if (daysDiff >= 7 && daysDiff < 14) return 'Dose 3 (Day 7)'
  //if daysDiff is greater than or equal to 14 and less than 28, return Dose 4 (Day 14)
  if (daysDiff >= 14 && daysDiff < 28) return 'Dose 4 (Day 14)'
  //if daysDiff is greater than or equal to 28, return Dose 5 (Day 28)
  if (daysDiff >= 28) return 'Dose 5 (Day 28)'

  return 'Dose 1 (Day 0)'
}
