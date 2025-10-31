import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav>
      <ul>
        <h6>General Links</h6>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <h6>Patient Links</h6>
        <li>
          <Link to="/p/dashboard">Patient Dashboard</Link>
        </li>
        <li>
          <Link to="/p/my-profile">Patient Profile</Link>
        </li>
        <li>
          <Link to="/p/my-profile">Patient Profile</Link>
        </li>
        <li>
          <Link to="/p/make-appointment">Make Appointment</Link>
        </li>
        <h6>Staff Links</h6>
        <li>
          <Link to="/s/dashboard">Staff Dashboard</Link>
        </li>
        <li>
          <Link to="/s/patient/profile">Staff view patient profile page</Link>
        </li>
        <li>
          <Link to="/s/patient/register">Staff register patient page</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
