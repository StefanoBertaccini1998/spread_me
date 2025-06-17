import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks/useRedux';
import { logoutUser } from '../redux/slices/userSlice';
import styles from './Navbar.module.css';

export default function Navbar() {
  const user = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();
  const [openFinance, setOpenFinance] = useState(false);

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
            <div
              className={`${styles.dropdown} ${openFinance ? styles.open : ''}`}
              onMouseLeave={() => setOpenFinance(false)}
            >
              <button
                className={styles.link}
                type="button"
                onClick={() => setOpenFinance((o) => !o)}
              >
                Gestione Finanza ▾
              </button>
              <div className={styles.menu}>
                <NavLink
                  to="/finance/expenses"
                  className={styles.menuLink}
                  onClick={() => setOpenFinance(false)}
                >
                  Spese
                </NavLink>
                <NavLink
                  to="/finance/incomes"
                  className={styles.menuLink}
                  onClick={() => setOpenFinance(false)}
                >
                  Entrate
                </NavLink>
                <NavLink
                  to="/finance/transfers"
                  className={styles.menuLink}
                  onClick={() => setOpenFinance(false)}
                >
                  Trasferimenti
                </NavLink>
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