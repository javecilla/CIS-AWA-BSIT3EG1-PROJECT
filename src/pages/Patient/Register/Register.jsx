import { Link } from 'react-router-dom'
import './Register.css'

function Register() {
  return (
    <div>
      <h1>Registration page for client/patient Page</h1>
      <h6>Pages related to registration</h6>
      <ul>
        <li>
          <Link to="/p/onboarding/verify-email">Verify Email</Link>
        </li>
        <li>
          <Link to="/p/onboarding/set-password">Set Password</Link>
        </li>
      </ul>
    </div>
  )
}

export default Register
