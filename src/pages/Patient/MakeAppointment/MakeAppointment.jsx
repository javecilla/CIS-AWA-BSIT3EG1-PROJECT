import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MakeAppointment.css';
import SelectReason from '@/components/AppointmentSteps/SelectReason';
import AppointmentForm from '@/components/AppointmentSteps/AppointmentForm';
import FollowUpForm from '@/components/AppointmentSteps/FollowUpForm';
import FollowUpConfirmation from '@/components/AppointmentSteps/FollowUpConfirmation';
import AppointmentConfirmation from '@/components/AppointmentSteps/AppointmentConfirmation';
import Header from '@/components/Header';

function MakeAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    appointmentReason: '',
    appointmentReasonLabel: '',
    branch: '',
    appointmentDate: '',
    timeSlot: '',
    incidentDate: '',
    exposureBite: false,
    exposureLick: false,
    exposureContamination: false,
    exposureScratch: false,
    exposureAbrasion: false,
    exposureNibble: false,
    animalType: '',
    biteLocation: '',
    animalVaccinationStatus: '',
    hasAllergies: '',
    hasReceivedVaccine: '',
    allergies: '',
    lastShotDate: '',
    primaryReason: '',
    newConditions: '',
    confirmPolicy: false,
    name: ''
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleStep1Next = () => {
    if (!formData.appointmentReason) {
      return; 
    }

    const reasonLabel = formData.appointmentReason === 'newBite' 
      ? 'New Bite or Scratch Incident' 
      : 'Follow-up / General Consultation';
    
    setFormData({
      ...formData,
      appointmentReasonLabel: reasonLabel
    });

    nextStep();
  };

    const validateAppointmentForm = () => {
    const newErrors = {};

    if (!formData.branch || formData.branch === "Select") {
      newErrors.branch = "Please select a valid branch.";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required.";
    }
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Time slot is required.";
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = "Date of incident is required.";
    }

    const exposureSelected =
      formData.exposureBite ||
      formData.exposureLick ||
      formData.exposureScratch ||
      formData.exposureAbrasion ||
      formData.exposureContamination ||
      formData.exposureNibble;
    if (!exposureSelected) {
      newErrors.exposure = "Please select at least one type of exposure.";
    }

    if (!formData.animalType || formData.animalType.trim() === "") {
      newErrors.animalType = "Please specify the type of animal.";
    }

    if (!formData.biteLocation || formData.biteLocation.trim() === "") {
      newErrors.biteLocation = "Bite location is required.";
    }

    if (!formData.animalVaccinationStatus || formData.animalVaccinationStatus === "Select") {
      newErrors.animalVaccinationStatus = "Please select the animal's vaccination status.";
    }

    if (!formData.hasAllergies) {
      newErrors.hasAllergies = "Please select yes or no.";
    } else if (formData.hasAllergies === "yes" && (!formData.allergies || formData.allergies.trim() === "")) {
      newErrors.allergies = "Please specify your allergies.";
    }

    if (!formData.hasReceivedVaccine) {
      newErrors.hasReceivedVaccine = "Please select yes or no.";
    } else if (formData.hasReceivedVaccine === "yes" && (!formData.lastShotDate || formData.lastShotDate.trim() === "")) {
      newErrors.lastShotDate = "Please specify when your last shot was.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFollowUpForm = () => {
    const newErrors = {};

    if (!formData.branch || formData.branch === "") {
      newErrors.branch = "Please select a branch.";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Please choose an appointment date.";
    }
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please choose a preferred time slot.";
    }

    if (!formData.primaryReason || formData.primaryReason.trim() === "") {
      newErrors.primaryReason = "Please provide the primary reason for this visit.";
    }

    if (!formData.newConditions || formData.newConditions.trim() === "") {
      newErrors.newConditions = "Please list any new allergies or medical conditions (or enter 'None').";
    }

    if (!formData.confirmPolicy) {
      newErrors.confirmPolicy = "You must confirm the details before proceeding.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    
    let isValid = false;
    
    if (formData.appointmentReason === 'newBite') {
      isValid = validateAppointmentForm();
    } else if (formData.appointmentReason === 'followUp') {
      isValid = validateFollowUpForm();
    }

    if (isValid) {
      setErrors({});
      nextStep();
    }
  };

  const handleRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Header />
    
      <div className="container py-5 d-flex align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-lg-12">
            {step === 1 && (
              <SelectReason 
                formData={formData} 
                handleChange={handleChange} 
                nextStep={handleStep1Next} 
              />
            )}
            
            {step === 2 && formData.appointmentReason === 'newBite' && (
              <AppointmentForm 
                formData={formData} 
                handleChange={handleChange} 
                nextStep={handleStep2Submit} 
                prevStep={prevStep}
                errors={errors}
              />
            )}
            
            {step === 2 && formData.appointmentReason === 'followUp' && (
              <FollowUpForm 
                formData={formData} 
                handleChange={handleChange} 
                nextStep={handleStep2Submit} 
                prevStep={prevStep}
                errors={errors}
              />
            )}
            
            {step === 3 && formData.appointmentReason === 'newBite' && (
              <AppointmentConfirmation 
                formData={formData} 
                handleRedirect={handleRedirect} 
              />
            )}
            
            {step === 3 && formData.appointmentReason === 'followUp' && (
              <FollowUpConfirmation 
                formData={formData} 
                handleRedirect={handleRedirect} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MakeAppointment;