export const getInitialAppointmentFormData = () => {
  const savedFormData = localStorage.getItem('patientMakeAppointmentFormData')

  if (savedFormData) {
    try {
      return JSON.parse(savedFormData)
    } catch (e) {
      console.error('Error parsing saved form data:', e)
    }
  }

  return {
    appointmentReason: '', // 'newBite' or 'followUp'

    branch: '',
    appointmentDate: '',
    timeSlot: '',

    incidentDate: '',
    exposureBite: false,
    exposureLick: false,
    exposureScratch: false,
    exposureAbrasion: false,
    exposureContamination: false,
    exposureNibble: false,
    animalType: '',
    biteLocation: '',
    animalVaccinationStatus: '',

    hasAllergies: '',
    allergies: '',
    hasReceivedVaccine: '',
    lastShotDate: '',

    primaryReason: '',
    newConditions: '',
    confirmPolicy: false
  }
}

export const getInitialAppointmentStep = () => {
  const savedStep = localStorage.getItem('patientMakeAppointmentStep')
  return savedStep ? parseInt(savedStep) : 1
}
