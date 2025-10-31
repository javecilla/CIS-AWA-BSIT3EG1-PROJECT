## HOSTING

### 1. Install Firebase CLI

npm install -g firebase-tools

### 2. Login to Firebase

firebase login

### 3. Initialize Firebase in Project Root

firebase init

### 4. Build Your App for Production

npm run build

### 5. Deploy Manually

firebase deploy --only hosting

## REALTIME DATABASE

### 1. Create Database in Firebase Console

- Go to Build -> Realtime Database -> Create Database.
- Select a location (e.g., asia-southeast1).
- Start in **test mode** for initial setup.

### 2. Install Firebase SDK

npm install firebase

### 3. Configure in `firebase/config.js`

- Add `getDatabase` from "firebase/database".
- Export the `db` instance.

### 4. Configure Security Rules (For Testing)

- Go to Realtime Database -> Rules tab.
- Set both `.read` and `.write` to `"true"`.

## AUTHENTICATION

### 1. Enable Provider in Firebase Console

- Go to Build -> Authentication -> Sign-in method.
- Select and **Enable** the "Email/Password" provider.

### 2. Install Firebase SDK

- (Already done in the database step)

### 3. Configure in `firebase/config.js`

- Add `getAuth` from "firebase/auth".
- Export the `auth` instance.

### 4. Use in Your Code

- Import functions like `createUserWithEmailAndPassword` from "firebase/auth".
- Import the `auth` instance from your config file.
