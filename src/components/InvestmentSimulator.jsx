import { useState, useId } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { loadHistoricalData } from '../redux/asyncThunks/investmentThunks';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './InvestmentSimulator.module.css';

const InvestmentSimulator = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.investment.historicalData);
    const [symbol, setSymbol] = useState('SPY');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [finalValue, setFinalValue] = useState(null);
    const [error, setError] = useState('');
    const idPrefix = useId();

    const validateInputs = () => {
        if (!symbol || !startDate || !endDate || amount === '') {
            setError('Compila tutti i campi');
            return false;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end) || start > end) {
            setError('Date non valide');
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

    const handleSimulate = async () => {
        if (!validateInputs()) return;
        try {
            const result = await dispatch(
                loadHistoricalData({ symbol, startDate, endDate })
            ).unwrap();
            if (result.length >= 2) {
                const initial = result[0].close;
                const final = result[result.length - 1].close;
                const value = parseFloat(amount) * (final / initial);
                setFinalValue(value);
            } else {
                setError('Dati insufficienti per il simbolo inserito');
            }
        } catch (err) {
            setError('Errore nel recupero dati, simbolo non valido?');
        }
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>💹 Simulatore Investimento</h2>
            <div className={styles.formGroup}>
                <label htmlFor={`${idPrefix}-symbol`}>
                    Simbolo
                </label>
                <input
                    id={`${idPrefix}-symbol`}
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className={styles.input}
                />
                <label htmlFor={`${idPrefix}-start`}> 
                    Data inizio
                </label>
                <input
                    id={`${idPrefix}-start`}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.input}
                />
                <label htmlFor={`${idPrefix}-end`}>
                    Data fine
                </label>
                <input
                    id={`${idPrefix}-end`}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.input}
                />
                <label htmlFor={`${idPrefix}-amount`}>
                    Importo (€)
                </label>
                <input
                    id={`${idPrefix}-amount`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleSimulate} className={styles.button}>
                    Calcola e Simula
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {data.length > 0 && (
                <div className={styles.graphWrapper}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="close" stroke="#4f46e5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {finalValue !== null && (
                <div className={styles.resultBox}>
                    Valore finale stimato: <strong>€ {finalValue.toFixed(2)}</strong>
                </div>
            )}
        </div>
    );
};

export default InvestmentSimulator;