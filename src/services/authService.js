import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth'
import { ref, get, child, set } from 'firebase/database'
import { auth, db } from '@/libs/firebase'
import {
  getFirebaseErrorMessage,
  isAuthError,
  isRateLimitError,
  WEAK_PASSWORD_CODE,
  REQUIRES_RECENT_LOGIN_CODE,
  WRONG_PASSWORD_CODE,
  INVALID_CREDENTIAL_CODE,
  NO_USER_CODE
} from '@/constants/error-messages'

export const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return {
      success: true,
      user: userCredential.user,
      emailVerified: userCredential.user.emailVerified
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

export const logout = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

export const sendEmailVerification = async (user) => {
  try {
    await firebaseSendEmailVerification(user)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

// reload user to get latest auth state
export const reloadUser = async (user) => {
  try {
    await user.reload()
    return {
      success: true,
      emailVerified: user.emailVerified
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

// get current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser
}

// subscribe to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export const getUserData = async (uid) => {
  try {
    const userRef = child(ref(db), `users/${uid}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      }
    } else {
      return {
        success: false,
        error: {
          code: 'user-not-found',
          message: 'User profile data not found.'
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: getFirebaseErrorMessage(
          error.code,
          'Failed to fetch user data.'
        )
      }
    }
  }
}

export const registerWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return {
      success: true,
      user: userCredential.user
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = ref(db, `users/${uid}`)
    await set(userRef, userData)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: getFirebaseErrorMessage(
          error.code,
          'Failed to create user profile.'
        )
      }
    }
  }
}

// complete patient registration, creates Firebase auth account, saves user data to database, and sends verification email
export const registerPatient = async ({ email, password, userData }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // save user data to database
    const userRef = ref(db, `users/${user.uid}`)
    await set(userRef, {
      ...userData,
      createdAt: new Date().toISOString()
    })

    // send verification email
    await firebaseSendEmailVerification(user)

    // sign out user (they need to verify email first)
    await firebaseSignOut(auth)

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code)
      }
    }
  }
}

// check if email already exists in Firebase Auth and Realtime Database
export const checkEmailExists = async (email) => {
  try {
    if (!email || email.trim() === '') {
      return { exists: false, error: null }
    }

    const trimmedEmail = email.trim()

    // check Firebase Authentication first
    let existsInAuth = false
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, trimmedEmail)
      existsInAuth = signInMethods.length > 0
    } catch (authError) {
      // if there's an error checking Auth (e.g., invalid email format), continue to check database
      console.warn('Error checking Firebase Auth:', authError)
    }

    // check Realtime Database for email in users collection
    // since we can't query by email directly, we need to get all users and check
    // this is not ideal for large datasets, but necessary for email validation
    //note: ang processo kase pag firebase admin pa hahahah
    let existsInDatabase = false
    try {
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)

      if (snapshot.exists()) {
        const users = snapshot.val()
        // check all user entries for matching email
        // check both user.email and user.contactInfo.emailAddress fields
        existsInDatabase = Object.values(users).some((user) => {
          if (!user || typeof user !== 'object') return false
          return (
            user.email === trimmedEmail ||
            user.contactInfo?.emailAddress === trimmedEmail
          )
        })
      }
    } catch (dbError) {
      console.error('Error checking Realtime Database:', dbError)
      // if database check fails, we'll rely on Auth check
    }

    // email exists if it's in either Auth or Database
    const exists = existsInAuth || existsInDatabase

    return {
      exists,
      error: null,
      existsInAuth,
      existsInDatabase
    }
  } catch (error) {
    // if there's an unexpected error, treat as doesn't exist
    // the email format validation will catch invalid emails separately
    console.error('Error checking email existence:', error)
    return {
      exists: false,
      error: {
        code: error.code || 'unknown',
        message: getFirebaseErrorMessage(
          error.code,
          'Failed to check email existence.'
        )
      }
    }
  }
}

// get user-friendly error message
export const getAuthErrorMessage = (errorCode) => {
  return getFirebaseErrorMessage(errorCode)
}

// re-export error checking functions from constants for backward compatibility
export { isAuthError, isRateLimitError }

// update user password, requires reauthentication with current password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser

    if (!user) {
      return {
        success: false,
        error: {
          code: NO_USER_CODE,
          message: 'No authenticated user found. Please log in again.'
        }
      }
    }

    // reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword)

    try {
      await reauthenticateWithCredential(user, credential)
    } catch (reauthError) {
      if (
        reauthError.code === WRONG_PASSWORD_CODE ||
        reauthError.code === INVALID_CREDENTIAL_CODE
      ) {
        return {
          success: false,
          error: {
            code: reauthError.code,
            message: 'Incorrect current password. Please try again.'
          }
        }
      }

      return {
        success: false,
        error: {
          code: reauthError.code,
          message: 'Failed to verify current password. Please try again.'
        }
      }
    }

    // update password
    await firebaseUpdatePassword(user, newPassword)

    return {
      success: true
    }
  } catch (error) {
    console.error('Password update error:', error)

    if (error.code === WEAK_PASSWORD_CODE) {
      return {
        success: false,
        error: {
          code: error.code,
          message:
            'The new password is too weak. Please choose a stronger password.'
        }
      }
    } else if (error.code === REQUIRES_RECENT_LOGIN_CODE) {
      return {
        success: false,
        error: {
          code: error.code,
          message:
            'For security reasons, please log out and log back in before changing your password.'
        }
      }
    }

    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: error.message || 'Something went wrong. Please try again.'
      }
    }
  }
}
