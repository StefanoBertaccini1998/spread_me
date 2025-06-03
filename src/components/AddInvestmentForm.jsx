import { useState } from 'react';
import styles from './AddInvestmentForm.module.css';

const AddInvestmentForm = ({ onAdd }) => {
    const [symbol, setSymbol] = useState('');
    const [startDate, setStartDate] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symbol || !startDate || !amount) return;

        const newInvestment = {
            id: Date.now(),
            symbol,
            startDate,
            amount: parseFloat(amount),
            pac: false,
        };

        onAdd(newInvestment);
        setSymbol('');
        setStartDate('');
        setAmount('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Simbolo" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="€" />
            <button type="submit">Aggiungi</button>
        </form>
    );
};

export default AddInvestmentForm;
