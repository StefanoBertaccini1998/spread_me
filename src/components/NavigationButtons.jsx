import { useNavigate } from 'react-router-dom';
import styles from './NavigationButtons.module.css';

const NavigationButtons = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={() => navigate('/add-expense')}>➕ Aggiungi Spesa</button>
            <button className={styles.button} onClick={() => navigate('/add-income')}>➕ Aggiungi Entrata</button>
            <button className={styles.button} onClick={() => navigate('/add-transfer')}>🔁 Aggiungi Trasferimento</button>
            <button className={styles.button} onClick={() => navigate('/import')}>📥 Importa Dati</button>
        </div>
    );
};

export default NavigationButtons;
