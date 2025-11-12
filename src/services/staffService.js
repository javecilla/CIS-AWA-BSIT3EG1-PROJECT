import { ref, onValue, get, remove, update, set } from 'firebase/database'
import { db, functions, httpsCallable } from '@/libs/firebase'
import { APPOINTMENT_STATUS } from '@/constants/appointments'
import { formatFullName } from '@/utils/formatter'
import {
  generatePatientId,
  generateAppointmentId,
  generateWalkinPatientUID
} from '@/utils/generator'
import {
  buildWalkinPatientData,
  buildWalkinAppointmentData,
  buildMedicalHistoryUpdate
} from '@/utils/walkin-registration'

//subscribe to appointment metrics changes, returns appointment counts by status in real-time
export const subscribeToAppointmentMetrics = (callback, errorCallback) => {
  const appointmentsRef = ref(db, 'appointments')

  const unsubscribe = onValue(
    appointmentsRef,
    (snapshot) => {
      try {
        if (snapshot.exists()) {
          const allUsersData = snapshot.val()

          // flatten all appointments from all users into a single array
          const allAppointmentsArray = Object.values(allUsersData).flatMap(
            (userAppointments) => Object.values(userAppointments)
          )

          // count appointments by status (excluding cancelled and no-show)
          const cancelledStatusLower =
            APPOINTMENT_STATUS.CANCELLED.toLowerCase()
          const noShowStatusLower = APPOINTMENT_STATUS.NO_SHOW.toLowerCase()

          const statusCounts = allAppointmentsArray.reduce(
            (acc, appt) => {
              const status = appt.status ? appt.status.toLowerCase() : ''

              // skip cancelled and no-show appointments from status counts
              if (
                status === cancelledStatusLower ||
                status === noShowStatusLower
              ) {
                return acc
              }

              if (status === APPOINTMENT_STATUS.PENDING.toLowerCase()) {
                acc.pending += 1
              } else if (
                status === APPOINTMENT_STATUS.CONFIRMED.toLowerCase()
              ) {
                acc.confirmed += 1
              } else if (
                status === APPOINTMENT_STATUS.IN_CONSULTATION.toLowerCase()
              ) {
                acc.inConsultation += 1
              } else if (
                status === APPOINTMENT_STATUS.COMPLETED.toLowerCase()
              ) {
                acc.completed += 1
              }
              return acc
            },
            {
              pending: 0,
              confirmed: 0,
              inConsultation: 0,
              completed: 0
            }
          )

          // calculate total as sum of all active status counts
          // this ensures total always matches the sum of displayed statuses
          const total =
            statusCounts.pending +
            statusCounts.confirmed +
            statusCounts.inConsultation +
            statusCounts.completed

          const metrics = {
            total,
            ...statusCounts
          }

          callback(metrics)
        } else {
          // no appointments found
          callback({
            total: 0,
            pending: 0,
            confirmed: 0,
            inConsultation: 0,
            completed: 0
          })
        }
      } catch (error) {
        console.error('Error processing appointment metrics:', error)
        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    (error) => {
      console.error('Error fetching appointment metrics:', error)
      if (errorCallback) {
        errorCallback(error)
      }
    }
  )

  return unsubscribe
}

// subscribe to patient metrics changes, returns patient counts by gender and registration type in real-time
export const subscribeToPatientMetrics = (callback, errorCallback) => {
  const usersRef = ref(db, 'users')

  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      try {
        if (snapshot.exists()) {
          const usersData = snapshot.val()
          const allUserIds = Object.keys(usersData)
          const allUsers = Object.values(usersData)

          const patients = allUsers.filter((user) => user.role === 'patient')

          const totalPatients = patients.length

          const stats = {
            male: 0,
            female: 0,
            walkIn: 0,
            online: 0
          }

          allUserIds.forEach((userId) => {
            const user = usersData[userId]

            if (user.role === 'patient') {
              // Count by gender
              if (user.sex === 'Male') {
                stats.male += 1
              } else if (user.sex === 'Female') {
                stats.female += 1
              }

              if (userId.startsWith('walkin_')) {
                stats.walkIn += 1
              } else {
                stats.online += 1
              }
            }
          })

          const metrics = {
            total: totalPatients,
            ...stats
          }

          callback(metrics)
        } else {
          callback({
            total: 0,
            male: 0,
            female: 0,
            walkIn: 0,
            online: 0
          })
        }
      } catch (error) {
        console.error('Error processing patient metrics:', error)
        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    (error) => {
      console.error('Error fetching patient metrics:', error)
      if (errorCallback) {
        errorCallback(error)
      }
    }
  )

  return unsubscribe
}

// subscribe to all patients in real-time
export const subscribeToAllPatients = (callback, errorCallback) => {
  const usersRef = ref(db, 'users')

  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      try {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const data = snapshot.val()
        const allUsers = Object.keys(data).map((uid) => ({
          uid: uid,
          ...data[uid]
        }))

        const patientList = allUsers.filter((user) => user.role === 'patient')

        patientList.sort((a, b) => {
          const dateA = new Date(a.createdAt || '1970-01-01T00:00:00.000Z')
          const dateB = new Date(b.createdAt || '1970-01-01T00:00:00.000Z')
          return dateB - dateA
        })

        callback(patientList)
      } catch (error) {
        console.error('Error processing patients:', error)
        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    (error) => {
      console.error('Error fetching patients:', error)
      if (errorCallback) {
        errorCallback(error)
      }
    }
  )

  return unsubscribe
}

// fetch all patients (one-time fetch)
export const fetchAllPatients = async () => {
  try {
    const usersRef = ref(db, 'users')
    const snapshot = await get(usersRef)

    if (!snapshot.exists()) {
      return { success: true, data: [] }
    }

    const data = snapshot.val()
    const allUsers = Object.keys(data).map((uid) => ({
      uid: uid,
      ...data[uid]
    }))

    const patientList = allUsers.filter((user) => user.role === 'patient')

    patientList.sort((a, b) => {
      const dateA = new Date(a.createdAt || '1970-01-01T00:00:00.000Z')
      const dateB = new Date(b.createdAt || '1970-01-01T00:00:00.000Z')
      return dateB - dateA
    })

    return { success: true, data: patientList }
  } catch (error) {
    console.error('Error fetching patients:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message:
          error.message || 'Failed to load patient list. Please try again.'
      }
    }
  }
}

// check if a patient is a walk-in patient
export const isWalkInPatient = (uid) => {
  return uid && uid.startsWith('walkin_')
}

// delete a patient record and all associated appointments
export const deletePatient = async (uid) => {
  try {
    // validate UID
    if (!uid || typeof uid !== 'string') {
      return {
        success: false,
        error: {
          code: 'invalid-uid',
          message: 'Invalid patient UID provided.'
        }
      }
    }

    const isWalkIn = isWalkInPatient(uid)

    // delete from Realtime Database
    const userRef = ref(db, `users/${uid}`)
    const appointmentsRef = ref(db, `appointments/${uid}`)

    await Promise.all([remove(userRef), remove(appointmentsRef)])

    // delete from Firebase Authentication (only for online patients)
    if (!isWalkIn) {
      try {
        const deleteUserFunction = httpsCallable(functions, 'deleteUser')
        const result = await deleteUserFunction({ uid })
        console.log('Auth deletion result:', result.data)
      } catch (authError) {
        console.error('Error deleting user from Auth:', authError)
        // continue even if Auth deletion fails - DB records are already deleted
        // return success but log the Auth error
        return {
          success: true,
          isWalkIn: false,
          message:
            'Patient record deleted. Note: There was an issue deleting the authentication account.',
          authError: authError.message
        }
      }
    }

    return {
      success: true,
      isWalkIn,
      message: 'Patient record deleted successfully.'
    }
  } catch (error) {
    console.error('Error deleting patient record:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message:
          error.message || 'Failed to delete patient record. Please try again.'
      }
    }
  }
}

// subscribe to all appointments with patient information in real-time
export const subscribeToAllAppointments = (callback, errorCallback) => {
  const appointmentsRef = ref(db, 'appointments')

  const unsubscribe = onValue(
    appointmentsRef,
    async (snapshot) => {
      try {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const allData = snapshot.val()
        const appointmentsArray = []

        // flatten all appointments from all users into a single array
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

        // fetch user data for each appointment
        const appointmentsWithUserData = await Promise.all(
          appointmentsArray.map(async (appointment) => {
            try {
              const userRef = ref(db, `users/${appointment.userId}`)
              const userSnapshot = await get(userRef)

              if (userSnapshot.exists()) {
                const userData = userSnapshot.val()
                return {
                  ...appointment,
                  patientName:
                    formatFullName(userData.fullName) || 'Unknown Patient',
                  patientId: userData.patientId || 'N/A',
                  patientEmail: userData.email || 'N/A'
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
          const dateA = new Date(a.createdAt || '1970-01-01T00:00:00.000Z')
          const dateB = new Date(b.createdAt || '1970-01-01T00:00:00.000Z')
          return dateB - dateA
        })

        callback(appointmentsWithUserData)
      } catch (error) {
        console.error('Error processing appointments:', error)
        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    (error) => {
      console.error('Error fetching appointments:', error)
      if (errorCallback) {
        errorCallback(error)
      }
    }
  )

  return unsubscribe
}

// fetch all appointments with patient information (one-time fetch)
export const fetchAllAppointments = async () => {
  try {
    const appointmentsRef = ref(db, 'appointments')
    const snapshot = await get(appointmentsRef)

    if (!snapshot.exists()) {
      return { success: true, data: [] }
    }

    const allData = snapshot.val()
    const appointmentsArray = []

    // flatten all appointments from all users into a single array
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

    // fetch user data for each appointment
    const appointmentsWithUserData = await Promise.all(
      appointmentsArray.map(async (appointment) => {
        try {
          const userRef = ref(db, `users/${appointment.userId}`)
          const userSnapshot = await get(userRef)

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val()
            return {
              ...appointment,
              patientName:
                formatFullName(userData.fullName) || 'Unknown Patient',
              patientId: userData.patientId || 'N/A',
              patientEmail: userData.email || 'N/A'
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
      const dateA = new Date(a.createdAt || '1970-01-01T00:00:00.000Z')
      const dateB = new Date(b.createdAt || '1970-01-01T00:00:00.000Z')
      return dateB - dateA
    })

    return { success: true, data: appointmentsWithUserData }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message:
          error.message || 'Failed to load appointments. Please try again.'
      }
    }
  }
}

// update appointment status
export const updateAppointmentStatus = async (
  userId,
  appointmentId,
  status,
  additionalFields = {}
) => {
  try {
    if (!userId || !appointmentId || !status) {
      return {
        success: false,
        error: {
          code: 'invalid-argument',
          message:
            'Missing required parameters (userId, appointmentId, status).'
        }
      }
    }

    const appointmentRef = ref(db, `appointments/${userId}/${appointmentId}`)

    const updateData = {
      status: status,
      ...additionalFields
    }

    await update(appointmentRef, updateData)

    return {
      success: true,
      message: 'Appointment status updated successfully.'
    }
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message:
          error.message ||
          'Failed to update appointment status. Please try again.'
      }
    }
  }
}

// register a walk-in patient and create their appointment
export const registerWalkinPatient = async (
  formData,
  staffUID,
  hasPatientRecord,
  selectedPatientUID = null
) => {
  try {
    if (!staffUID || typeof staffUID !== 'string') {
      return {
        success: false,
        error: {
          code: 'invalid-staff-uid',
          message: 'Invalid staff UID provided.'
        }
      }
    }

    let patientUID = selectedPatientUID
    let patientId = null

    // scenario 1: new patient registration (walk-in without auth account)
    if (!hasPatientRecord && !selectedPatientUID) {
      try {
        patientId = generatePatientId()
        patientUID = generateWalkinPatientUID()

        const patientData = buildWalkinPatientData(
          formData,
          patientId,
          staffUID
        )

        const userRef = ref(db, `users/${patientUID}`)
        await set(userRef, patientData)

        console.log('Walk-in patient record created successfully:', patientUID)
      } catch (error) {
        console.error('Error creating walk-in patient record:', error)
        return {
          success: false,
          error: {
            code: error.code || 'unknown',
            message:
              error.message ||
              'Failed to create walk-in patient record. Please try again.'
          }
        }
      }
    } else if (hasPatientRecord && selectedPatientUID) {
      // SCENARIO 2: Existing patient - fetch patient ID
      try {
        const userRef = ref(db, `users/${selectedPatientUID}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const userData = snapshot.val()
          patientId = userData.patientId || 'N/A'
        }
      } catch (error) {
        console.error('Error fetching existing patient data:', error)
        return {
          success: false,
          error: {
            code: error.code || 'unknown',
            message:
              error.message ||
              'Failed to fetch existing patient data. Please try again.'
          }
        }
      }
    }

    if (!patientUID) {
      return {
        success: false,
        error: {
          code: 'invalid-patient-uid',
          message: 'Patient selection or creation failed. Please try again.'
        }
      }
    }

    const appointmentId = generateAppointmentId()

    const appointmentData = buildWalkinAppointmentData(
      formData,
      appointmentId,
      staffUID,
      patientUID,
      formData.appointmentReason
    )

    const appointmentRef = ref(
      db,
      `appointments/${patientUID}/${appointmentId}`
    )
    await set(appointmentRef, appointmentData)

    // update medical history if new bite incident
    let medicalHistoryUpdate = null
    if (formData.appointmentReason === 'newBite') {
      medicalHistoryUpdate = buildMedicalHistoryUpdate(formData)
      if (medicalHistoryUpdate) {
        const medicalHistoryRef = ref(db, `users/${patientUID}/medicalHistory`)
        await update(medicalHistoryRef, medicalHistoryUpdate)
      }
    }

    return {
      success: true,
      appointmentId: appointmentId,
      patientUID: patientUID,
      patientId: patientId,
      message:
        'Walk-in patient registered and appointment created successfully.'
    }
  } catch (error) {
    console.error('Error registering walk-in patient:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message:
          error.message ||
          'Failed to register walk-in patient. Please try again.'
      }
    }
  }
}
