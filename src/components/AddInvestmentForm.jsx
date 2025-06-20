import { useState } from 'react';
import styles from './AddInvestmentForm.module.css';
import PropTypes from 'prop-types';

const AddInvestmentForm = ({ onAdd }) => {
    const [symbol, setSymbol] = useState('');
    const [startDate, setStartDate] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const validate = () => {
        if (!symbol || !startDate || amount === '') {
            setError('Compila tutti i campi');
            return false;
        }
        const date = new Date(startDate);
        if (isNaN(date.getTime()) || date > new Date()) {
            setError('Data non valida');
            return false;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Importo non valido');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newInvestment = {
            id: Date.now(),
            symbol,
            startDate,
            amount: parseFloat(amount),
            transactions: [
                { date: startDate, amount: parseFloat(amount) }
            ],
            pacEnabled: false,
        };

        onAdd(newInvestment);
        setSymbol('');
        setStartDate('');
        setAmount('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Simbolo" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="€" />
            <button type="submit">Aggiungi</button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
};

AddInvestmentForm.prototypes = {
    onAdd: PropTypes.func.isRequired,
};
export default AddInvestmentForm;
