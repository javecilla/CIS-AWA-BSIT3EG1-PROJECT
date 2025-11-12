import { useState } from 'react'
import PersonalInformationForm from '@/components/Forms/PersonalInformationForm'
import ContactInformationForm from '@/components/Forms/ContactInformationForm'
import Alert from '@/components/Alert'
import {
  validatePersonalInformation,
  validateContactInformation
} from '@/utils/form-validation'
import { updatePersonalInformation } from '@/services/patientService'

function PersonalInformation({ userData, refreshUserData, action = 'edit' }) {
  // console.log(userData)
  const isViewMode = action === 'view'

  const [formData, setFormData] = useState(() => ({
    // Personal Information
    firstName: userData.fullName.firstName || '',
    lastName: userData.fullName.lastName || '',
    middleName: userData.fullName.middleName || '',
    suffix: userData.fullName.suffix || '',
    dateOfBirth: userData.dateOfBirth || '',
    sex: userData.sex || '',
    houseNoStreet: userData.address.houseNoStreet || '',
    barangay: userData.address.barangay || '',
    cityMunicipality: userData.address.cityMunicipality || '',
    province: userData.address.province || '',
    zipCode: userData.address.zipCode || '',
    // Contact Information
    mobileNumber: userData.contactInfo.mobileNumber || '',
    emergencyContactName: userData.emergencyContact.name || '',
    emergencyContactRelationship: userData.emergencyContact.relationship || '',
    emergencyContactNumber: userData.emergencyContact.mobileNumber || ''
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const { AlertComponent, showAlert } = Alert()

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    //clear field-specific errors
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const personalInfoValidation = validatePersonalInformation(formData, {
      requireAll: false
    })

    if (personalInfoValidation.hasErrors) {
      setValidationErrors(personalInfoValidation.errors)
      showAlert(
        'Please fill in all required personal information fields correctly.',
        'danger',
        { persist: true }
      )
      return
    }

    const validationcontactInfoValidation = await validateContactInformation(
      formData,
      {
        includeConsent: false,
        includeEmail: false,
        requireRecaptcha: false,
        requireAll: false
      }
    )

    if (validationcontactInfoValidation.hasErrors) {
      setValidationErrors(validationcontactInfoValidation.errors)
      showAlert(
        'Please fill in all required contact information fields correctly.',
        'danger',
        { persist: true }
      )
      return
    }

    try {
      setIsSubmitting(true)
      const updates = {
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          suffix: formData.suffix
        },
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
        address: {
          houseNoStreet: formData.houseNoStreet,
          barangay: formData.barangay,
          cityMunicipality: formData.cityMunicipality,
          province: formData.province,
          zipCode: formData.zipCode
        },
        contactInfo: {
          mobileNumber: formData.mobileNumber
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          mobileNumber: formData.emergencyContactNumber
        }
      }
      await updatePersonalInformation(userData.uid, updates)
      refreshUserData()
      showAlert('Update successful!', 'success')
    } catch (error) {
      // console.error('Error updating personal information:', error)
      showAlert(
        'Error updating personal information. Please try again.',
        'danger'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="personal-info-card">
        <form onSubmit={handleSubmit} className="personal-info-form" noValidate>
          <AlertComponent />

          <div className="mb-5">
            <h3 className="section-title">PERSONAL INFORMATION</h3>
            <PersonalInformationForm
              formData={formData}
              handleChange={handleChange}
              errors={validationErrors}
              isSubmitting={isSubmitting}
              disabled={isViewMode}
            />
          </div>

          <div className="mb-5">
            <h3 className="section-title">CONTACT INFORMATION</h3>
            <ContactInformationForm
              formData={formData}
              handleChange={handleChange}
              errors={validationErrors}
              isSubmitting={isSubmitting}
              disabled={isViewMode}
              includeEmail={false}
              includeConsent={false}
            />
          </div>

          {!isViewMode && (
            <>
              <hr className="break-line mb-4" />

              <button
                type="submit"
                className="btn w-100 btn-login py-2 mb-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </>
  )
}

export default PersonalInformation
