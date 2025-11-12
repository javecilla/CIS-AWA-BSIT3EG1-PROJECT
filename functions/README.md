# Firebase Cloud Functions

This directory contains Firebase Cloud Functions for backend operations that require Admin SDK privileges.

## Setup

1. Install dependencies:

```bash
cd functions
npm install
```

2. Deploy functions:

```bash
firebase deploy --only functions
```

## Functions

### `deleteUser`

Deletes a user from Firebase Authentication using Admin SDK.

**Parameters:**

- `uid` (string): User UID to delete

**Returns:**

- `success` (boolean): Whether the operation succeeded
- `message` (string): Status message
- `isWalkIn` (boolean): Whether the user was a walk-in patient

**Note:** This function requires authentication and should only be called by staff members.
