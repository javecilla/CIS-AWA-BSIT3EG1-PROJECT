import './Header.css';
import BreadCrumb from '@/components/BreadCrumb';
import { useUser } from '@/contexts/UserContext';

function Header() {
  const { userData, loading } = useUser();

  if (loading) {
    return null;
  }

  const lastName = userData?.fullName?.lastName || 'Guest';

  return (
    <header className="welcome-section">
      <div className="header-container container welcome-top-section d-flex flex-row justify-content-between">
        <BreadCrumb />
        <h3>
          Welcome Back,{' '}
          <strong>{String(lastName).toUpperCase()}</strong>
          !
        </h3>
      </div>
    </header>
  );
}

export default Header
