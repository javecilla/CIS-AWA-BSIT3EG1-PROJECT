import registerImage from '@/assets/register-step3-image.png'
import logoClinic from '@/assets/logo-clinic.png'

export default function Finished(handleRedirect) {
  return (
    <div className="row align-items-start">
    
        <div className="col-lg-6 mb-4 mb-lg-0 p-0">
            <img src={registerImage} className="w-100 rounded-4"/>
        </div>

        <div className="col-lg-6">

            <div className="d-flex align-items-center mb-3">
                <img src={logoClinic} className="logo-circle me-3" />
                <div>
                    <h4 className="fw-medium mb-0">Animal Bite</h4>
                    <h4 className="fw-bold">CENTER</h4>
                </div>
            </div>

            <h5 className="fw-semibold my-4 title-text">Patient Registration</h5>

            <div className="d-flex justify-content-center align-items-center mb-4 gap-2 mx-4">

                <div className="text-center">
                    <div className="step-circle active">1</div>
                    <p className="small fw-medium mt-2">Personal Information</p>
                </div>

                <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

                <div className="text-center">
                    <div className="step-circle active">2</div>
                    <p className="small fw-medium mt-2">Contact Information</p>
                </div>

                <div className="flex-grow-0 mx-3 border-top border-2 step-line"/>

                <div className="text-center">
                    <div className="step-circle active">3</div>
                    <p className="small fw-medium mt-2">Finished</p>
                </div>

            </div>

            <div className="d-flex jusify-content-center align-items-center flex-column mb-4 px-3 text-center">
                <h4 className="fw-bolder mb-2 fs-2">Account Created Successfully</h4>
                <p className="mb-3 text-middle fw-bold">
                    Welcome, <strong></strong> Your secure patient profile is now ready.
                </p>

                <p className="text-under mt-4 mb-5 fw-medium">
                    Your Unique Patient ID is:
                    <br />
                    <strong className="id-number"></strong>
                    <br />
                    Save this ID for future reference.
                </p>
                <button className="btn btn-primary access-btn fs-4 py-3" onClick={handleRedirect}>Access my Account</button>
            </div>
            
                              
        </div>
    
    </div>
  )
}

            