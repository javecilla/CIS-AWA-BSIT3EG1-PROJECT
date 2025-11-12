# Firebase Cloud Functions Setup Guide

This guide explains how to set up and deploy Firebase Cloud Functions for deleting users from Firebase Authentication.

## Prerequisites

1. Firebase CLI installed globally:

```bash
npm install -g firebase-tools
```

2. Logged in to Firebase:

```bash
firebase login
```

3. Firebase project initialized (if not already):

```bash
firebase init functions
```

## Setup Steps

### 1. Install Function Dependencies

Navigate to the `functions` directory and install dependencies:

```bash
cd functions
npm install
```

### 2. (Optional) Local Development with Service Account

If you want to test functions locally with a service account key:

1. Download your service account key from Firebase Console:

   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file (e.g., `serviceAccountKey.json`)

2. Update `functions/index.js` to use the service account:

```javascript
const serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://cis-awa-bsit3eg1-project-default-rtdb.asia-southeast1.firebasedatabase.app'
})
```

3. **Important:** Add `serviceAccountKey.json` to `.gitignore`:

```
functions/serviceAccountKey.json
```

### 3. Deploy Functions

Deploy all functions:

```bash
firebase deploy --only functions
```

Or deploy a specific function:

```bash
firebase deploy --only functions:deleteUser
```

### 4. Test Locally (Optional)

To test functions locally before deploying:

```bash
cd functions
npm run serve
```

This starts the Firebase emulator. You can test your functions at `http://localhost:5001`.

## Functions

### `deleteUser`

Deletes a user from Firebase Authentication using Admin SDK.

**Call from Frontend:**

```javascript
import { functions, httpsCallable } from '@/libs/firebase'

const deleteUserFunction = httpsCallable(functions, 'deleteUser')
const result = await deleteUserFunction({ uid: 'user-uid-here' })
```

**Security:**

- Requires authentication (user must be logged in)
- You can add role checking in the function to ensure only staff can delete users

## Troubleshooting

### Function Not Found Error

If you get "Function not found" error:

1. Make sure the function is deployed: `firebase deploy --only functions`
2. Check that the function name matches exactly: `deleteUser`
3. Verify you're calling from the correct Firebase project

### Permission Denied

If you get permission errors:

1. Check Firebase Functions IAM permissions in Google Cloud Console
2. Ensure the calling user is authenticated
3. Verify database security rules allow the operation

### Service Account Issues

For deployed functions, you don't need a service account key file - Firebase automatically provides credentials. Only use service account keys for local testing.

## Next Steps

1. Add role-based security to the `deleteUser` function to ensure only staff can delete users
2. Add logging for audit trails
3. Consider adding additional validation and error handling
