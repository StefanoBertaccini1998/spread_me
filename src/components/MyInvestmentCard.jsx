import { useState } from 'react';
import styles from './MyInvestmentCard.module.css';

const MyInvestmentCard = ({ data, onUpdate }) => {
    const [pacEnabled, setPacEnabled] = useState(data.pacEnabled || data.pac);
    const [showForm, setShowForm] = useState(false);
    const [txAmount, setTxAmount] = useState('');
    const [txDate, setTxDate] = useState('');
    const [error, setError] = useState('');


    const togglePac = () => {
        setPacEnabled(!pacEnabled);
        onUpdate({ id: data.id, updates: { pacEnabled: !pacEnabled } });
    };

    const handleAddTx = () => {
        if (!txAmount || !txDate) {
            setError('Inserisci importo e data');
            return;
        }
        const date = new Date(txDate);
        if (isNaN(date.getTime()) || date > new Date()) {
            setError('Data non valida');
            return;
        }
        const parsed = parseFloat(txAmount);
        if (isNaN(parsed) || parsed < 0) {
            setError('Importo non valido');
            return;
        }
        const txs = data.transactions ? [...data.transactions] : [];
        txs.push({ amount: parsed, date: txDate });
        onUpdate({ id: data.id, updates: { transactions: txs } });
        setTxAmount('');
        setTxDate('');
        setError('');
        setShowForm(false);
    };

    const transactions = data.transactions || [{ amount: data.amount }];
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className={styles.card}>
            <div className={styles.symbol}><strong>{data.symbol}</strong></div>
            <div className={styles.date}>📅 {data.startDate}</div>
            <div className={styles.amount}>💰 €{total}</div>
            <button onClick={togglePac} className={styles.pacButton}>
                {pacEnabled ? 'Disattiva PAC' : 'Attiva PAC'}
            </button>
            <button onClick={() => setShowForm(!showForm)} className={styles.pacButton}>
                Aggiungi Operazione
            </button>
            {showForm && (
                <div className={styles.txForm}>
                    <input
                        type="number"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        placeholder="Importo"
                    />
                    <input
                        type="date"
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                    />
                    <button onClick={handleAddTx} className={styles.pacButton}>
                        Salva
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default MyInvestmentCard;
