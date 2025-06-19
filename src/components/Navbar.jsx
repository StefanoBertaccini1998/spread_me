import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks/useRedux';
import { logoutUser } from '../redux/slices/userSlice';
import styles from './Navbar.module.css';

export default function Navbar() {
  const user = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();
  const [openFinance, setOpenFinance] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = () => setNavOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link to={user ? '/dashboard' : '/'} className={styles.brand}>
        <img src="/fta.svg" alt="Finance Tracker logo" className={styles.logo} />
        Finance Tracker
      </Link>

      <button
        className={`${styles.burger} ${navOpen ? styles.burgerOpen : ''}`}
        onClick={() => setNavOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`${styles.links} ${navOpen ? styles.linksOpen : ''}`}>
        {!user && (
          <NavLink to="/" className={styles.link} onClick={closeNav}>Home</NavLink>
        )}
        {user ? (
          <>
            <NavLink to="/dashboard" className={styles.link} onClick={closeNav}>Dashboard</NavLink>

            <div className={styles.dropdown}>
              <button
                className={styles.link}
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent closing nav
                  setOpenFinance((o) => !o);
                }}
              >
                Gestione Finanza {openFinance ? '▴' : '▾'}
              </button>

              {openFinance && (
                <div className={styles.menu}>
                  <NavLink to="/finance/expenses" className={styles.menuLink} onClick={() => { setOpenFinance(false); closeNav(); }}>Spese</NavLink>
                  <NavLink to="/finance/incomes" className={styles.menuLink} onClick={() => { setOpenFinance(false); closeNav(); }}>Entrate</NavLink>
                  <NavLink to="/finance/transfers" className={styles.menuLink} onClick={() => { setOpenFinance(false); closeNav(); }}>Trasferimenti</NavLink>
                </div>
              )}
            </div>

            <NavLink to="/investments" className={styles.link} onClick={closeNav}>Investimenti</NavLink>
            <NavLink to="/profile" className={styles.link} onClick={closeNav}>👤 Profilo</NavLink>

            <button onClick={() => { dispatch(logoutUser()); closeNav(); }} className={styles.logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={styles.link} onClick={closeNav}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}
