import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { authenticateUser, createUser } from '../redux/asyncThunks/userThunks';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('login'); // 'login' | 'create'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const idPrefix = useId();

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(email)) {
            setError("Inserisci un'email valida.");
            return;
        }

        setLoading(true);
        try {
            await dispatch(
                mode === 'login' ? authenticateUser(email) : createUser(email)
            ).unwrap();
            navigate('/dashboard');
        } catch (err) {
            // err può essere una stringa passata da rejectWithValue
            let message;
            if (typeof err === 'string') {
                message = err;
            } else if (mode === 'login') {
                message = 'Errore durante il login. Riprova.';
            } else {
                message = "Errore durante la creazione dell'account.";
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    let buttonText;
    if (loading) {
        buttonText = 'Caricamento...';
    } else if (mode === 'login') {
        buttonText = 'Login';
    } else {
        buttonText = 'Crea Account';
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{mode === 'login' ? 'Login' : 'Crea Account'}</h2>

            <div className={styles.toggleWrapper}>
                <button
                    className={`${styles.toggleButton} ${mode === 'login' ? styles.active : ''}`}
                    onClick={() => setMode('login')}
                >
                    Login
                </button>
                <button
                    className={`${styles.toggleButton} ${mode === 'create' ? styles.active : ''}`}
                    onClick={() => setMode('create')}
                >
                    Crea Account
                </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label htmlFor={`${idPrefix}-email`} className={styles.label}>Email</label>
                    <input
                        id={`${idPrefix}-email`}
                        type="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button} disabled={loading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
};

export default Login;