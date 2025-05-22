import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404 - Pagina Non Trovata</h1>
            <p className={styles.description}>Oops! Sembra che tu abbia digitato un percorso sbagliato.</p>
            <button className={styles.button} onClick={() => navigate('/')}>Torna alla Home</button>
        </div>
    );
};

export default ErrorPage;
