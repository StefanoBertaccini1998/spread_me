import { useNavigate } from 'react-router-dom';
import './NavigationButtons.css';

const NavigationButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="navigation-buttons">
            <button onClick={() => navigate('/add-expense')}>➕ Aggiungi Spesa</button>
            <button onClick={() => navigate('/add-income')}>➕ Aggiungi Entrata</button>
            <button onClick={() => navigate('/add-transfer')}>🔁 Aggiungi Trasferimento</button>
            <button onClick={() => navigate('/import')}>📥 Importa Dati</button>
        </div>
    );
};

export default NavigationButtons;
