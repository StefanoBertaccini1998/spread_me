import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <img src="/fta.svg" alt="Logo Finance Tracker" className={styles.heroImage} />
                <h1 className={styles.title}>📊 Benvenuto in FinanceManager</h1>
                <p className={styles.description}>
                    Questa applicazione ti aiuta a gestire <strong>spese</strong>, <strong>entrate</strong> e <strong>trasferimenti</strong> con facilità.
                </p>
            </div>

            <section className={styles.section}>
                <h2>🚀 Novità</h2>
                <ul className={styles.list}>
                    <li>Gestione completa di <strong>conti</strong> e <strong>categorie</strong></li>
                    <li>Dashboard <strong>Investimenti</strong> con calcolatori e grafici</li>
                    <li>Importazione rapida di dati da file Excel o CSV</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>🧭 Guida Rapida</h2>
                <ol>
                    <li>Vai su <strong>Importa</strong> e carica il tuo file Excel</li>
                    <li>Controlla i dati nelle sezioni <strong>Spese</strong>, <strong>Entrate</strong> e <strong>Bonifici</strong></li>
                    <li>Aggiungi o modifica voci, categorie e conti secondo le tue esigenze</li>
                </ol>
            </section>

            <button className={styles.button} onClick={() => navigate('/dashboard')}>
                Inizia ora
            </button>
        </div>
    );
};

export default HomePage;