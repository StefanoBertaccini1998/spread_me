import { useState } from 'react';
import styles from './InvestmentCalculator.module.css';

const MOCK_ANNUAL_RETURN = 0.15;

const InvestmentCalculator = () => {
    const [symbol, setSymbol] = useState('VOO');
    const [startDate, setStartDate] = useState('');
    const [amount, setAmount] = useState('');
    const [finalValue, setFinalValue] = useState(null);

    const handleCalculate = () => {
        if (!startDate || !amount || isNaN(parseFloat(amount))) return;

        const today = new Date();
        const start = new Date(startDate);
        const years = (today - start) / (1000 * 60 * 60 * 24 * 365.25);

        const value = parseFloat(amount) * Math.pow(1 + MOCK_ANNUAL_RETURN, years);
        setFinalValue(value);
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>📊 Calcolatore Investimento</h2>
            <div className={styles.formGroup}>
                <label>
                    Importo iniziale (€)
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.input}
                        placeholder="1000"
                    />
                </label>
                <label>
                    Data Inizio
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    Titolo (simbolo)
                    <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className={styles.input}>
                        <option value="VOO">VOO</option>
                        <option value="SPY">SPY</option>
                        <option value="QQQ">QQQ</option>
                        <option value="ARKK">ARKK</option>
                        <option value="TLT">TLT</option>
                    </select>
                </label>
                <button onClick={handleCalculate} className={styles.button}>
                    Calcola Crescita
                </button>

                {finalValue !== null && (
                    <div className={styles.result}>
                        Valore finale stimato: <strong>€ {finalValue.toFixed(2)}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentCalculator;
