import { useNavigate } from 'react-router-dom';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, bgColor, type, currentFilters }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/finance/${type}`, { state: { filters: currentFilters } });
    };

    return (
        <div className={`${styles.card} ${bgColor}`} onClick={handleClick}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.value}>{value}</p>
        </div>
    );
};

export default StatCard;