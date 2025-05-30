import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks/useRedux';
import { logoutUser } from '../redux/slices/userSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const user = useAppSelector(state => state.userSettings.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => dispatch(logoutUser());

  return (
    <nav className={styles.navbar}>
      <div className={styles.title}>Finance Tracker</div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className={styles.link}>Dashboard</Link>
            <div className="relative group">
              <button className={styles.link}>Gestione Finanza ▾</button>
              <div className={`hidden group-hover:flex flex-col absolute bg-white text-primary shadow-lg mt-1 z-50 ${styles.dropdownMenu}`}>
                <Link to="/finance/expenses" className={styles.dropdownLink}>Spese</Link>
                <Link to="/finance/incomes" className={styles.dropdownLink}>Entrate</Link>
                <Link to="/finance/transfers" className={styles.dropdownLink}>Trasferimenti</Link>
              </div>
            </div>
            <Link to="/profile" className={`${styles.link} flex items-center gap-1`}>
              <span role="img" aria-label="profile">👤</span> Profilo
            </Link>
            <button onClick={handleLogout} className={styles.button}>Logout</button>
          </>
        ) : (
          <Link to="/login" className={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;