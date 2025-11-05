import './Header.css'
import BreadCrumb from '@/components/BreadCrumb'
import { useUser } from '@/context/UserContext'

function Header() {
  const { userData, loading } = useUser()

  // console.log('User Data in Header:', userData)
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <header className="welcome-section">
      <div className="welcome-top-section d-flex flex-row justify-content-between">
        <BreadCrumb />
        <h3>
          Welcome Back,{' '}
          <strong>{userData.fullName.lastName.toUpperCase() || 'Guest'}</strong>
          !
        </h3>
      </div>
    </header>
  )
}

export default Header
