import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { login } from '../redux/slices/authSlice';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email));
        navigate('/dashboard');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>
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
                <button type="submit" className={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;