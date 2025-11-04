import './Login.css'
import loginImage from '@/assets/login-image.png'
import logoClinic from '@/assets/logo-clinic.png'

function Login() {
  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-10">
          <div className="row align-items-center">

            <div className="col-lg-6 mb-4 mb-lg-0">
              <img src={loginImage} className="left-img"/>
            </div>

            <div className="col-lg-6">
              <div className="login-card my-3">

                <div className="d-flex align-items-center mb-3">
                  <img src={logoClinic} className="logo-circle me-3 logo"/>
                  <div>
                    <h4 className="fw-medium mb-0 logo-text">Animal Bite</h4>
                    <h4 className="fw-bold logo-text">CENTER</h4>
                  </div>
                </div>

                <p className="text-under fw-medium">Login to your account</p>

                <label className="fw-medium field-label">Email:</label>
                <p className="text-muted small m-0 mb-3">Enter your email associated to your account.</p>
                <input type="email" className="form-control mb-4 mt-1" placeholder="e.g., john.doe@example.net"/>

                <label className="fw-medium field-label">Password</label>
                <input type="password" className="form-control mb-4 mt-1"/>

                <hr className="break-line mb-4"/>

                <button className="btn w-100 login-btn py-2 mb-2">Login</button>

                <p className="mt-3 text-center">
                  Don’t have an account?&nbsp;
                  <a href="#" className="text-primary">register here</a>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
