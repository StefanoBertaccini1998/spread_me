import { useState } from 'react';
import styles from './MyInvestmentCard.module.css';

const MyInvestmentCard = ({ data, onUpdate }) => {
    const [pacEnabled, setPacEnabled] = useState(data.pac);

    const togglePac = () => {
        const updated = { ...data, pac: !pacEnabled };
        setPacEnabled(!pacEnabled);
        onUpdate(updated);
    };

    return (
        <div className={styles.card}>
            <div className={styles.symbol}><strong>{data.symbol}</strong></div>
            <div className={styles.date}>📅 {data.startDate}</div>
            <div className={styles.amount}>💰 €{data.amount}</div>
            <button onClick={togglePac} className={styles.pacButton}>
                {pacEnabled ? 'Disattiva PAC' : 'Attiva PAC'}
            </button>
        </div>
    );
};

export default MyInvestmentCard;
