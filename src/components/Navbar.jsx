import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-title">
        Finance Tracker
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            {/* Dropdown for Financial Management */}
            <div className="relative group">
              <button className="navbar-link">Gestione Finanza ▾</button>
              <div className="dropdown-menu hidden group-hover:flex flex-col absolute bg-white text-primary shadow-lg mt-1 z-50">
                <Link to="/finance/expenses" className="dropdown-link">Spese</Link>
                <Link to="/finance/income" className="dropdown-link">Entrate</Link>
                <Link to="/finance/transfers" className="dropdown-link">Trasferimenti</Link>
              </div>
            </div>
            {/* Profile Button */}
            <Link to="/profile" className="navbar-link flex items-center gap-1">
              <span role="img" aria-label="profile">👤</span> Profilo
            </Link>
            <button onClick={logout} className="navbar-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
