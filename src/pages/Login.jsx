import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { authenticateUser } from '../redux/asyncThunks/userThunks';
import { createUser } from '../redux/asyncThunks/createUserThunk';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('login'); // 'login' | 'create'
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await dispatch(mode === 'login' ? authenticateUser(email) : createUser(email)).unwrap();
            console.log("Login success", result);
            navigate('/dashboard');
        } catch (err) {
            setError(mode === 'login' ? 'Errore durante il login. Riprova.' : "Errore durante la creazione dell'account.");
        }
    };

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
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button}>
                    {mode === 'login' ? 'Login' : 'Crea Account'}
                </button>
            </form>
        </div>
    );
};

export default Login;