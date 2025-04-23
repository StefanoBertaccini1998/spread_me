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
