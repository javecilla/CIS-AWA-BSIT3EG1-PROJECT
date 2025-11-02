# EmailJS Integration Guide

This guide covers integrating EmailJS in a React (Vite) project with reCAPTCHA v2 verification.

---

## 1. Install EmailJS SDK

Install the official EmailJS SDK for JavaScript.

```bash
npm install @emailjs/browser
```

## 2. Create EmailJS Account and Service

- 1. Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account.
- 2. After logging in, navigate to the Email Services section and add a new email
- service (e.g., Gmail, Yahoo, etc.).
- 3. Note down the Service ID provided.
- 4. Next, create an email template in the Email Templates section.
- 5. Note down the Template ID provided.
- 6. Finally, go to the Account section to find your Public API Key.
- 7. (Optional) For added security, you can also generate a Private API Key.
- 8. Note down the Public and Private API Keys.
- 9. Also, set the sender email address in your email template or account settings.
- 10. Note down the sender email address.
- 11. You will need the following details for integration:
  - Service ID
  - Template ID
  - Public API Key
  - (Optional) Private API Key
  - Sender Email Address

## 3. Add EmailJS Config to .env File

Place the EmailJS configuration in your `.env` file at the project root.

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_API_KEY=your_public_api_key
VITE_EMAILJS_PRIVATE_API_KEY=your_private_api_key
VITE_EMAILJS_SENDER_MAIL=your_sender_email_address
```

## 4. Integrate EmailJS in Your React Component

- Step A: Import EmailJS and reCAPTCHA
  In your React component file, import the necessary modules.

  ```jsx
  import emailjs from '@emailjs/browser'
  import ReCAPTCHA from 'react-google-recaptcha'
  ```

- Step B: Set Up Form State and Handlers
  Set up state variables for form inputs, reCAPTCHA token, and submission status.

  ```jsx
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const recaptchaRef = useRef(null)
  ```

- Step C: Handle Form Submission
  Create a function to handle form submission, including reCAPTCHA verification and sending the email via EmailJS.

  ```jsx
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')
    setIsError(false)

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      setStatusMessage('Please complete the reCAPTCHA.')
      setIsError(true)
      setIsSubmitting(false)
      return
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_API_KEY

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      setStatusMessage('Email sent successfully!')
      setName('')
      setEmail('')
      setMessage('')
      recaptchaRef.current.reset()
      setRecaptchaToken(null)
    } catch (error) {
      setStatusMessage('Failed to send email. Please try again later.')
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }
  ```

- Step D: Render the Form with reCAPTCHA
  Render the form in your component, including the reCAPTCHA component.

  ```jsx
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        required
      ></textarea>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY}
        onChange={(token) => setRecaptchaToken(token)}
        onExpired={() => setRecaptchaToken(null)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Email'}
      </button>
      {statusMessage && (
        <p className={isError ? 'error' : 'success'}>{statusMessage}</p>
      )}
    </form>
  )
  ```
