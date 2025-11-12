import { useState, useEffect } from 'react'
import { fetchAllPatients } from '@/services/staffService'
import { formatFullName } from '@/utils/formatter'
import PersonalInformationForm from '@/components/Forms/PersonalInformationForm'
import ContactInformationForm from '@/components/Forms/ContactInformationForm'

function PatientDetailsForm({
  formData,
  handleChange,
  showErrors,
  errors = {},
  generalError,
  emailFieldError,
  emailInputRef,
  onPatientSelect,
  hasPatientRecord: hasPatientRecordProp,
  onHasPatientRecordChange,
  handleBlur
}) {
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [selectedPatientUID, setSelectedPatientUID] = useState('')
  const [searchInput, setSearchInput] = useState('')

  //console.log(`hasPatientRecordProp ${hasPatientRecordProp}`)
  const hasPatientRecord =
    hasPatientRecordProp !== undefined ? hasPatientRecordProp : true

  const handleCheckPatient = (e) => {
    const isChecked = e.target.checked
    const newHasRecord = !isChecked

    if (onHasPatientRecordChange) {
      onHasPatientRecordChange(newHasRecord)
    }

    if (isChecked) {
      setSelectedPatientUID('')
      setSearchInput('')
      if (onPatientSelect) {
        onPatientSelect(null)
      }
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true)
      const result = await fetchAllPatients()

      if (result.success && result.data) {
        const patientsList = result.data.map((patient) => ({
          uid: patient.uid,
          patientId: patient.patientId || 'N/A',
          fullName: formatFullName(patient.fullName),
          email: patient.email || 'N/A'
        }))

        patientsList.sort((a, b) => a.fullName.localeCompare(b.fullName))
        setPatients(patientsList)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    } finally {
      setLoadingPatients(false)
    }
  }

  const handlePatientInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)

    const matchedPatient = patients.find(
      (patient) =>
        `${patient.fullName} (${patient.patientId})` === value ||
        patient.patientId === value
    )

    if (matchedPatient) {
      setSelectedPatientUID(matchedPatient.uid)
      if (onPatientSelect) {
        onPatientSelect(matchedPatient.uid)
      }
    } else {
      setSelectedPatientUID('')
      if (onPatientSelect) {
        onPatientSelect(null)
      }
    }
  }

  return (
    <>
      <div className="row mb-5">
        <div className="col-md-12 mb-2">
          <label className="fw-medium">Patient:</label>
          <small className="text-muted d-block mb-1 text-description">
            Please select a patient if the record already exists. Check the
            checkbox if patient has no record to fill up the patient details
            form.
          </small>

          {loadingPatients ? (
            <div className="text-center py-3">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Loading patients...
            </div>
          ) : (
            <>
              <input
                list="patients"
                name="patientSearch"
                id="patientSearch"
                className="form-control mt-1 input-list"
                placeholder="Select or type patient name or ID..."
                disabled={!hasPatientRecord}
                value={searchInput}
                onChange={handlePatientInputChange}
              />
              {errors.patientSearch && showErrors && (
                <div className="text-danger small-text">
                  {errors.patientSearch}
                </div>
              )}
              <datalist id="patients">
                {patients.map((patient) => (
                  <option
                    key={patient.uid}
                    value={`${patient.fullName} (${patient.patientId})`}
                  >
                    {/* {patient.email} */}
                    {`${patient.fullName} (${patient.patientId})`}
                  </option>
                ))}
              </datalist>

              {selectedPatientUID && hasPatientRecord && (
                <div
                  className="alert alert-primary mt-2 d-flex align-items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-check-circle me-2"></i>
                  <div>
                    <strong>Patient Selected:</strong> {searchInput}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-check mt-2">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                name="hasNoPatientRecord"
                checked={!hasPatientRecord}
                onChange={handleCheckPatient}
              />
              No patient record, I will fill up the form.
            </label>
          </div>
        </div>

        {!hasPatientRecord && (
          <>
            <div className="col-lg-6 px-4">
              <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>

              <PersonalInformationForm
                formData={formData}
                handleChange={handleChange}
                showErrors={showErrors}
                errors={errors}
              />
            </div>

            <div className="col-lg-6 px-4">
              <h6 className="fw-bold mb-3">CONTACT INFORMATION</h6>

              <ContactInformationForm
                formData={formData}
                handleChange={handleChange}
                showErrors={showErrors}
                errors={errors}
                emailFieldError={emailFieldError}
                emailInputRef={emailInputRef}
                handleBlur={handleBlur}
                includeConsent={true}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PatientDetailsForm
