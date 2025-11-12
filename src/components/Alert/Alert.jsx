import { useState, useEffect } from 'react'
import './Alert.css'

function Alert() {
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  const [autoDismiss, setAutoDismiss] = useState(true)

  const showAlert = (message, type, options = {}) => {
    const { persist = false, duration = 5000 } = options

    setAlertMessage(message)
    setAlertType(type)
    setAutoDismiss(!persist)

    if (!persist) {
      setTimeout(() => {
        setAlertMessage('')
        setAlertType('')
      }, duration)
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hideAlert = () => {
    setAlertMessage('')
    setAlertType('')
  }

  const getIconClass = (type) => {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check'
      case 'danger':
        return 'fa-solid fa-triangle-exclamation'
      case 'warning':
        return 'fa-solid fa-exclamation-triangle'
      case 'info':
        return 'fa-solid fa-info-circle'
      default:
        return 'fa-solid fa-info-circle'
    }
  }

  return {
    AlertComponent: () => (
      <>
        {alertMessage && alertType && (
          <div
            className={`alert alert-${alertType} d-flex align-items-center mb-3`}
            role="alert"
          >
            <i
              className={`${getIconClass(alertType)} bi flex-shrink-0 me-2`}
            ></i>
            <div>{alertMessage}</div>
          </div>
        )}
      </>
    ),
    showAlert,
    hideAlert
  }
}

export default Alert
