import './NavBrand.css'

function NavBrand({ className }) {
  return (
    <div className={`logo-container d-flex align-items-center ${className}`}>
      <img src="/assets/images/logo.png" alt="Main Logo" />
      <div className="text-logo d-flex flex-column">
        <h3 className="m-0">Animal Bite</h3>
        <h3 className="m-0">CENTER</h3>
      </div>
    </div>
  )
}

export default NavBrand
