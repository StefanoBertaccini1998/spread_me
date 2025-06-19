import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './Layout.module.css';
import useInitialDataLoad from '../../hooks/useInitialDataLoad';

export default function Layout() {
  useInitialDataLoad();
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};