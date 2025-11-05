import { Link } from 'react-router-dom'
import './Register.css'
import { useState } from 'react'
import PersonalInfo from '@/components/Steps/PersonalInfo'
import ContactInfo from '@/components/Steps/ContactInfo'
import Finished from '@/components/Steps/Finished'

function Register() {
  const [step, setStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

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
    setShowErrors(false);
    setStep(step - 1);
  }

  const handleStep1Next = () => {
    const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/;
    const zipRegex = /^[0-9]+$/;

    let hasError = false;

    const required = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "sex",
      "houseNoStreet",
      "barangay",
      "cityMunicipality",
      "province"
    ];

    required.forEach(field => {
      if (!formData[field] || formData[field].trim() === "") {
        hasError = true;
      }
    });

    if (formData.firstName && !nameRegex.test(formData.firstName)) hasError = true;
    if (formData.lastName && !nameRegex.test(formData.lastName)) hasError = true;
    if (formData.middleName && !nameRegex.test(formData.middleName)) hasError = true;
    if (formData.suffix && !nameRegex.test(formData.suffix)) hasError = true;

    if (formData.barangay && !nameRegex.test(formData.barangay)) hasError = true;
    if (formData.cityMunicipality && !nameRegex.test(formData.cityMunicipality)) hasError = true;
    if (formData.province && !nameRegex.test(formData.province)) hasError = true;

    if (formData.zipCode && !zipRegex.test(formData.zipCode)) hasError = true;

    if (hasError) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    nextStep();
  };

  const handleStep2Next = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^(09|\+639)\d{9}$/;
    const nameRegex = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s\-'.]+$/;

    let hasError = false;

    const required = [
      "mobileNumber",
      "emailAddress",
      "emergencyContactName",
      "emergencyContactRelationship",
      "emergencyContactNumber",
      "hasReviewed",
      "hasConsent",
      "hasAgreed"
    ];

    required.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        hasError = true;
      }
    });

    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber)) hasError = true;
    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) hasError = true;


    if (formData.emergencyContactNumber && !phoneRegex.test(formData.emergencyContactNumber)) {
      hasError = true;
    }

    if (formData.emergencyContactName && !nameRegex.test(formData.emergencyContactName)) {
      hasError = true;
    }

    if (formData.emergencyContactRelationship && !nameRegex.test(formData.emergencyContactRelationship)) {
      hasError = true;
    }

    if (hasError) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    nextStep();
  };


  function handleRedirect(){

  }

  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-12">
          {step === 1 && (
            <PersonalInfo formData={formData} handleChange={handleChange} nextStep={handleStep1Next} showErrors={showErrors}/>
          )}

          {step === 2 && (
            <ContactInfo formData={formData} handleChange={handleChange} nextStep={handleStep2Next} prevStep={prevStep} showErrors={showErrors}/>
          )}

          {step === 3 && <Finished handleRedirect={handleRedirect}/>}
        </div>
      </div>
    </div>

  )
}

export default Register
