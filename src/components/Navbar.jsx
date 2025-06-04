import { Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks/useRedux';
import { logoutUser } from '../redux/slices/userSlice';
import styles from './Navbar.module.css';

export default function Navbar() {
  const user = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Finance Tracker</Link>

      <input type="checkbox" id="nav-toggle" className="hidden peer" />
      <label htmlFor="nav-toggle" className={styles.burger}><span /></label>

      <div className={styles.links}>
        <NavLink to="/" className={styles.link}>Home</NavLink>
        {user ? (
          <>
            <NavLink to="/dashboard" className={styles.link}>Dashboard</NavLink>
            <div className={styles.dropdown}>
              <button className={styles.link}>Gestione Finanza ▾</button>
              <div className={styles.menu}>
                <NavLink to="/finance/expenses" className={styles.menuLink}>Spese</NavLink>
                <NavLink to="/finance/incomes" className={styles.menuLink}>Entrate</NavLink>
                <NavLink to="/finance/transfers" className={styles.menuLink}>Trasferimenti</NavLink>
              </div>
            </div>
            <NavLink to="/investments" className={styles.link}>Investimenti</NavLink>
            <NavLink to="/profile" className={styles.link}>👤 Profilo</NavLink>
            <button onClick={() => dispatch(logoutUser())} className={styles.logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={styles.link}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}