import './Header.css';

function Header({name}) {

    return (
        <>
        <div className="header d-flex justify-content-between align-items-center">
            <div className="header-left d-flex align-items-center">
                <div className="logo-container d-flex align-items-center">
                    <img src="/assets/images/logo.png" alt="Main Logo" />
                    <div className="text-logo d-flex flex-column">
                        <h3 className="m-0">Animal Bite</h3>
                        <h3 className="m-0">CENTER</h3>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <button className="btn btn-primary custom-logout-btn">Logout</button>
            </div>
        </div>

        <div className="welcome-section">
            <div className="welcome-top-section d-flex flex-row justify-content-between">
                <h3>Dashboard</h3>
                <h3>Welcome Back, {name}!</h3>
            </div>
        </div>
        </>
    );
}

export default Header;