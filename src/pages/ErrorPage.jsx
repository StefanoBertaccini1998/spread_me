import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <h1>404 - Pagina Non Trovata</h1>
            <p>Oops! Sembra che tu abbia digitato un percorso sbagliato.</p>
            <button onClick={() => navigate('/')}>Torna alla Home</button>
        </div>
    );
};

export default ErrorPage;
