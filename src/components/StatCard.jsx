import { useNavigate } from 'react-router-dom';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, bgColor, type, currentFilters }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (type)
            navigate(`/finance/${type}`, { state: { filters: currentFilters } });
    };

    return (
        <button
            type="button"
            className={`${styles.card} ${bgColor}`}
            onClick={handleClick}
        >
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.value}>{value}</p>
        </button>
    );
};

export default StatCard;