import './Loader.css'

function Loader() {
  return (
    <div className="container py-5 d-flex align-items-center min-vh-100 justify-content-center">
      <div
        className="spinner-border"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Loader
