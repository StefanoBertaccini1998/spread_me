import './StatCard.css';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, bgColor, type, currentFilters }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/finance/${type}`, { state: { filters: currentFilters } });
    };

    return (
        <div className={`stat-card ${bgColor}`} onClick={handleClick}>
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    );
};

export default StatCard;
