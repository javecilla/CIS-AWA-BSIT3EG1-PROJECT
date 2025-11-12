const functions = require('firebase-functions')
const admin = require('firebase-admin')

//use only for local development, uncomment the following:
// const serviceAccount = require('./serviceAccountKey.json')
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL:
//     'https://cis-awa-bsit3eg1-project-default-rtdb.asia-southeast1.firebasedatabase.app'
// })

//deployed functions, automatically initialized:
admin.initializeApp()

/**
 * Delete a user from Firebase Authentication
 * This function can only be called by authenticated staff members
 */
exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to delete users.'
    )
  }

  // Verify that the user is staff
  const callerUid = context.auth.uid
  try {
    const userSnapshot = await admin
      .database()
      .ref(`users/${callerUid}`)
      .once('value')

    if (!userSnapshot.exists()) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User profile not found.'
      )
    }

    const userData = userSnapshot.val()
    if (userData.role !== 'staff') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only staff members can delete users.'
      )
    }
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error
    }
    throw new functions.https.HttpsError(
      'internal',
      'Failed to verify user permissions.'
    )
  }

  const { uid } = data

  if (!uid || typeof uid !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid UID provided.'
    )
  }

  // Check if it's a walk-in patient (no auth account)
  if (uid.startsWith('walkin_')) {
    return {
      success: true,
      message: 'Walk-in patient - no auth account to delete.',
      isWalkIn: true
    }
  }

  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid)

    return {
      success: true,
      message: 'User deleted from Firebase Authentication successfully.',
      isWalkIn: false
    }
  } catch (error) {
    console.error('Error deleting user from Auth:', error)

    // Handle specific error cases
    if (error.code === 'auth/user-not-found') {
      return {
        success: true,
        message:
          'User not found in Authentication (may have been already deleted).',
        isWalkIn: false
      }
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to delete user from Authentication.'
    )
  }
})
