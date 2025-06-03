import { useState } from 'react';
import styles from './InvestmentForm.module.css';

const InvestmentForm = () => {
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const parsed = parseFloat(amount);
        if (!isNaN(parsed)) {
            const mockReturn = parsed * 1.15; // 15% mock return
            setResult(mockReturn);
        }
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Simulatore Investimento</h2>
            <div className={styles.formGroup}>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="Importo (€)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button className={styles.button} onClick={handleCalculate}>
                    Calcola
                </button>
                {result !== null && (
                    <div className={styles.result}>
                        Valore finale stimato: € {result.toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentForm;
