import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Benvenuto in FinanceManager</h1>
            <p className={styles.description}>
                Questa applicazione ti aiuta a gestire le tue <strong>spese</strong>, <strong>entrate</strong> e <strong>trasferimenti</strong> con facilità.
            </p>

            <section className={styles.section}>
                <h2>🎯 Obiettivo</h2>
                <p>Fornire un sistema semplice ed efficace per monitorare il tuo flusso di cassa personale.</p>
            </section>

            <section className={styles.section}>
                <h2>🧭 Guida Rapida</h2>
                <ol>
                    <li>Vai su <strong>Importa</strong> e carica il tuo file Excel</li>
                    <li>Controlla i dati nelle sezioni <strong>Spese</strong>, <strong>Entrate</strong>, e <strong>Bonifici</strong></li>
                    <li>Modifica o aggiungi nuove voci in ogni sezione</li>
                </ol>
            </section>

            <button className={styles.button} onClick={() => navigate('/dashboard')}>
                Inizia ora
            </button>
        </div>
    );
};

export default HomePage;