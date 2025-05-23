import { useNavigate } from 'react-router-dom';
import styles from './NavigationButtons.module.css';

const NavigationButtons = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={() => navigate('/finance/expenses?type=expenses&openModal=true')}>➕ Aggiungi Spesa</button>
            <button className={styles.button} onClick={() => navigate('/finance/income?type=income&openModal=true')}>➕ Aggiungi Entrata</button>
            <button className={styles.button} onClick={() => navigate('/finance/transfers?type=transfers&openModal=true')}>🔁 Aggiungi Trasferimento</button>
            <button className={styles.button} onClick={() => navigate('/import')}>📥 Importa Dati</button>
        </div>
    );
};

export default NavigationButtons;
