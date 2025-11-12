import { ref, get, update, onValue } from 'firebase/database'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { db, storage } from '@/libs/firebase'
import {
  generateProfileImageFileName,
  getProfileImageStoragePath
} from '@/utils/image-file'
import { calculateNextDose } from '@/utils/calculator'

// subscribe to patient appointments in real-time
export const subscribeToPatientAppointments = (
  uid,
  callback,
  errorCallback
) => {
  if (!uid) {
    if (errorCallback) {
      errorCallback(new Error('Patient UID is required'))
    }
    return () => {} // return no-op unsubscribe function
  }

  const appointmentsRef = ref(db, `appointments/${uid}`)

  const unsubscribe = onValue(
    appointmentsRef,
    (snapshot) => {
      try {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const data = snapshot.val()
        const appointmentsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }))

        // sort by createdAt desc; fallback to appointmentDate
        appointmentsArray.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.appointmentDate || 0)
          const dateB = new Date(b.createdAt || b.appointmentDate || 0)
          return dateB - dateA
        })

        callback(appointmentsArray)
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

// fetch patient appointments (one-time fetch)
export const fetchPatientAppointments = async (uid) => {
  try {
    const appointmentsRef = ref(db, `appointments/${uid}`)
    const snapshot = await get(appointmentsRef)

    if (!snapshot.exists()) {
      return []
    }

    const data = snapshot.val()
    const appointmentsArray = Object.keys(data).map((key) => ({
      id: key,
      ...data[key]
    }))

    // sort by createdAt desc; fallback to appointmentDate
    appointmentsArray.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.appointmentDate || 0)
      const dateB = new Date(b.createdAt || b.appointmentDate || 0)
      return dateB - dateA
    })

    return appointmentsArray
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

// reschedule an appointment for the given uid and appointmentId
export const rescheduleAppointment = async (
  uid,
  appointmentId,
  { branch, appointmentDate, timeSlot }
) => {
  const appointmentRef = ref(db, `appointments/${uid}/${appointmentId}`)
  await update(appointmentRef, {
    branch,
    appointmentDate,
    timeSlot,
    rescheduledAt: new Date().toISOString()
  })
}

// cancel an appointment for the given uid and appointmentId
export const cancelAppointment = async (uid, appointmentId) => {
  const appointmentRef = ref(db, `appointments/${uid}/${appointmentId}`)
  await update(appointmentRef, {
    status: 'Cancelled',
    cancelledAt: new Date().toISOString()
  })
}

export const updatePersonalInformation = async (uid, formData) => {
  const userRef = ref(db, `users/${uid}`)
  await update(userRef, formData)
}

// update profile image in Firebase Storage and Database
export const updateProfileImage = async (uid, imageFile, options = {}) => {
  try {
    const fileName = generateProfileImageFileName(uid, imageFile)
    const storagePath = getProfileImageStoragePath(uid, fileName)

    // delete old image if exists
    if (options.oldImagePath) {
      try {
        const oldImageRef = storageRef(storage, options.oldImagePath)
        await deleteObject(oldImageRef)
      } catch (deleteError) {
        console.warn('Could not delete old image:', deleteError)
        // continue anyway, old image might not exist
      }
    }

    const imageRef = storageRef(storage, storagePath)
    await uploadBytes(imageRef, imageFile)

    const downloadURL = await getDownloadURL(imageRef)

    const userRef = ref(db, `users/${uid}`)
    await update(userRef, {
      profileImage: downloadURL,
      profileImagePath: storagePath,
      updatedAt: Date.now()
    })

    return {
      success: true,
      downloadURL,
      storagePath
    }
  } catch (error) {
    console.error('Error updating profile image:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: error.message || 'Failed to update profile image.'
      }
    }
  }
}

// create a new appointment
export const createAppointment = async (uid, appointmentId, formData) => {
  try {
    // base appointment data (common for both types e.g., walkin and online patient)
    const appointmentData = {
      appointmentId: appointmentId,
      userId: uid,
      branch: formData.branch,
      appointmentDate: formData.appointmentDate,
      timeSlot: formData.timeSlot,
      status: 'Pending',
      createdAt: new Date().toISOString()
    }

    // medical history update (only for new bite)
    let medicalHistoryUpdate = null

    if (formData.appointmentReason === 'newBite') {
      const nextDose = calculateNextDose(
        formData.incidentDate,
        new Date(formData.appointmentDate)
      )

      // add incident-specific details
      appointmentData.type = 'Incident'
      appointmentData.incidentDetails = {
        primaryReason: nextDose,
        incidentDate: formData.incidentDate,
        exposures: {
          bite: formData.exposureBite,
          lick: formData.exposureLick,
          scratch: formData.exposureScratch,
          abrasion: formData.exposureAbrasion,
          contamination: formData.exposureContamination,
          nibble: formData.exposureNibble
        },
        animalType: formData.animalType,
        biteLocation: formData.biteLocation,
        animalVaccinationStatus: formData.animalVaccinationStatus
      }

      //  medical history update for user profile
      medicalHistoryUpdate = {
        hasAllergies: formData.hasAllergies,
        allergies: formData.hasAllergies === 'yes' ? formData.allergies : '',
        hasReceivedVaccine: formData.hasReceivedVaccine,
        lastShotDate:
          formData.hasReceivedVaccine === 'yes' ? formData.lastShotDate : ''
      }
    } else if (formData.appointmentReason === 'followUp') {
      //  follow-up specific details
      appointmentData.type = 'FollowUp'
      appointmentData.visitDetails = {
        primaryReason: formData.primaryReason,
        newConditions: formData.newConditions,
        confirmPolicy: formData.confirmPolicy
      }
    }

    // create appointment record
    const appointmentRef = ref(db, `appointments/${uid}/${appointmentId}`)
    await update(appointmentRef, appointmentData)

    return {
      success: true,
      appointmentData,
      medicalHistoryUpdate
    }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: error.message || 'Failed to create appointment.'
      }
    }
  }
}
