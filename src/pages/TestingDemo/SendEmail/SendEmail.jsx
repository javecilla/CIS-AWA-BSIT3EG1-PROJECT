import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import ReCAPTCHA from 'react-google-recaptcha'
import './SendEmail.css'

function SendEmail() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEST_TEMPLATE_ID
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_API_KEY
  const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_FRONTEND_KEY

  const resetForm = () => {
    setName('')
    setEmail('')
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
    setRecaptchaToken(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !email) {
      setStatusMessage('Name and Email are required.')
      setIsError(true)
      return
    }
    if (!recaptchaToken) {
      setStatusMessage('Please check the "I\'m not a robot" box.')
      setIsError(true)
      return
    }

    setIsSubmitting(true)
    setIsError(false)
    setStatusMessage('Sending test email...')

    // This object MUST match the variables in your EmailJS template
    const templateParams = {
      name: name,
      email: email
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('EmailJS SUCCESS!', response.status, response.text)
        setStatusMessage('Test email sent successfully! Check your inbox.')
        setIsError(false)
        resetForm()
      })
      .catch((err) => {
        console.error('EmailJS FAILED...', err)
        setStatusMessage('Failed to send email. Check console for errors.')
        setIsError(true)

        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setRecaptchaToken(null)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-4 border rounded-3 shadow-sm bg-light">
            <h2 className="h4 mb-4">Test EmailJS Integration</h2>

            {statusMessage && (
              <div
                className={`alert ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                role="alert"
              >
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label small">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label small">
                  Recipient Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., john.doe@gmail.com"
                  required
                />
              </div>

              <div className="mb-3 d-flex justify-content-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    'Send Test Email'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendEmail
