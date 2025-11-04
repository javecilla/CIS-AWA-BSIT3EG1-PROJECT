import { Link } from 'react-router-dom'
import './Register.css'
import { useState } from 'react'
import PersonalInfo from '@/components/Steps/PersonalInfo'
import ContactInfo from '@/components/Steps/ContactInfo'
import Finished from '@/components/Steps/Finished'

function Register() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    dateOfBirth: '',
    sex: '',
    houseNoStreet: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    zipCode: '',
    mobileNumber: '',
    emailAddress: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    hasReviewed: false,
    hasConsent: false,
    hasAgreed: false
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  function handleRedirect(){

  }

  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-12">
          {step === 1 && (
            <PersonalInfo formData={formData} handleChange={handleChange} nextStep={nextStep}/>
          )}

          {step === 2 && (
            <ContactInfo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep}/>
          )}

          {step === 3 && <Finished handleRedirect={handleRedirect}/>}
        </div>
      </div>
    </div>

  )
}

export default Register
