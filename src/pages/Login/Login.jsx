import { useState } from "react";
import "./Login.css";
import loginImage from "@/assets/images/login-image.png";
import logoClinic from "@/assets/images/logo-clinic.png";
import { NavLink } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showErrors, setShowErrors] = useState(false);

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    setShowErrors(true);

    if (!formData.email || !emailRegex.test(formData.email) || !formData.password) {
      return; // stop if invalid
    }

    console.log("Logging in...");
  };

  return (
    <div className="container py-5 d-flex align-items-center min-vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-lg-10">
          <div className="row align-items-center">

            <div className="col-lg-6 mb-4 mb-lg-0">
              <img src={loginImage} className="left-img" />
            </div>

            <div className="col-lg-6">
              <div className="login-card my-3">

                <div className="d-flex align-items-center mb-3">
                  <img src={logoClinic} className="logo-circle me-3 logo" />
                  <div>
                    <h4 className="fw-medium mb-0 logo-text">Animal Bite</h4>
                    <h4 className="fw-bold logo-text">CENTER</h4>
                  </div>
                </div>

                <p className="text-under fw-medium">Login to your account</p>

                <div className={`mb-3 ${showErrors && (!formData.email || !emailRegex.test(formData.email)) ? "my-0" : ""}`}>
                  <label className="fw-medium field-label">Email:</label>
                  <p className="text-muted small m-0">Enter your email associated to your account.</p>

                  <input
                    type="email"
                    name="email"
                    className={`form-control mt-1 ${
                      showErrors &&
                      (!formData.email || !emailRegex.test(formData.email))
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="e.g., john.doe@example.net"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.email && (
                    <div className="invalid-feedback d-block">
                      Email is required.
                    </div>
                  )}

                  {showErrors && formData.email && !emailRegex.test(formData.email) && (
                    <div className="invalid-feedback d-block">
                      Invalid email format.
                    </div>
                  )}
                </div>

                <div className={`mb-3 ${showErrors && !formData.password ? "my-0" : ""}`}>
                  <label className="fw-medium field-label">Password</label>

                  <input
                    type="password"
                    name="password"
                    className={`form-control mt-1 ${
                      showErrors && !formData.password ? "is-invalid" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />

                  {showErrors && !formData.password && (
                    <div className="invalid-feedback d-block">
                      Password is required.
                    </div>
                  )}
                </div>

                <hr className="break-line mb-4" />

                <button
                  className="btn w-100 login-btn py-2 mb-2"
                  onClick={handleLogin}
                >
                  Login
                </button>

                <p className="mt-3 text-center">
                  Don’t have an account?{" "}
                  <NavLink className="text-primary" to="/register">
                    register here
                  </NavLink>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
