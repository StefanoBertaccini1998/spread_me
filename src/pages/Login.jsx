import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email);
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-field">
                    <label className="login-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
