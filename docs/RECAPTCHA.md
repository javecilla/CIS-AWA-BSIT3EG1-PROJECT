# reCAPTCHA v2 (Checkbox) Setup Guide

This guide covers installing the reCAPTCHA v2 "I'm not a robot" checkbox in a React (Vite) project.

---

## 1. Install

Install the official React component library for reCAPTCHA.

```bash
npm install react-google-recaptcha
```

## 2. Create reCAPTCHA v2 Keys

Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create) to generate your keys.

- 1. Click the + (Create) icon in the top right.
- 2. For reCAPTCHA type, select "reCAPTCHA v2".
- 3. Under that, select the "'I'm not a robot' Checkbox" option.
- 4. In the Domains section, add `localhost` (for testing) and your production domain (e.g., `your-project.web.app`).
- 5. Accept the terms and click Submit.
- 6. Copy the Site Key and Secret Key provided.

## 3. Copy the Site Key and Secret Key provided.

Place the keys in your `.env` file at the project root.

# The Site Key from Step 2

VITE_RECAPTCHA_FRONTEND_KEY=RECAPTCHA_FRONTEND_KEY

# The Secret Key from Step 2 (for backend verification)

VITE_RECAPTCHA_BACKEND_KEY=RECAPTCHA_BACKEND_KEY

## 4. Integration

- Step A: Update `index.html`
  Add the reCAPTCHA v2 script to the `<head>` of your `index.html` file. (Ensure you are using api.js, not enterprise.js).
  ```html
  <script
    src="[https://www.google.com/recaptcha/api.js](https://www.google.com/recaptcha/api.js)"
    async
    defer
  ></script>
  ```
- Step B: Update Your React Component (.jsx)
  Import and use the `ReCAPTCHA` component inside your form.

  ```jsx
  import React, { useState, useEffect, useRef } from 'react'
  // 1. Import the component
  import ReCAPTCHA from 'react-google-recaptcha'

  // ... other imports (auth, etc.)

  function FirebaseAuthentication() {
    // ... other state (email, password, etc.)

    // 2. Add state for the token and a ref for the component
    const [recaptchaToken, setRecaptchaToken] = useState(null)
    const recaptchaRef = useRef(null)

    // 3. Get the site key from your .env file
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

    // 4. Create a validation function to check the token
    const validateForm = () => {
      if (!email || !password) {
        setStatusMessage('Email and password are required.')
        setIsError(true)
        return false
      }
      // Check if the box was ticked
      if (!recaptchaToken) {
        setStatusMessage('Please check the "I\'m not a robot" box.')
        setIsError(true)
        return false
      }
      return true
    }

    // 5. Call validateForm() in your submit handlers
    const handleLogin = async (e) => {
      e.preventDefault()
      if (!validateForm()) return // <-- Check validation

      // ... your login logic
      // NOTE: For full security, you should also send the
      // 'recaptchaToken' to a backend (like a Firebase Function)
      // to verify it with your SECRET_KEY.
    }

    const handleRegister = async (e) => {
      e.preventDefault()
      if (!validateForm()) return // <-- Check validation

      // ... your register logic
    }

    // 6. Add the component to your form render
    return (
      // ... other JSX
      <form onSubmit={handleLogin}>
        {/* ... email and password fields ... */}

        <div className="mb-3 d-flex justify-content-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
        </div>

        {/* ... submit buttons ... */}
      </form>
      // ... other JSX
    )
  }

  export default FirebaseAuthentication
  ```
