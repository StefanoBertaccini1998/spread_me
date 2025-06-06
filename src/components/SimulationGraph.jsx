import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { loadHistoricalData } from '../redux/asyncThunks/investmentThunks';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './SimulationGraph.module.css';

const SimulationGraph = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.investment.historicalData);
    const [symbol, setSymbol] = useState('SPY');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);

    const handleSimulate = async () => {
        if (!symbol || !startDate || !endDate) return;

        await dispatch(loadHistoricalData({ symbol, startDate, endDate }));

        setTimeout(() => {
            if (data.length >= 2) {
                const initial = data[0].close;
                const final = data[data.length - 1].close;
                const change = ((final - initial) / initial) * 100;

                setResult({
                    initial: initial.toFixed(2),
                    final: final.toFixed(2),
                    change: change.toFixed(2),
                });
            }
        }, 300); // leggero delay per assicurarsi che Redux abbia aggiornato
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>📉 Simulazione Performance</h2>
            <div className={styles.formGroup}>
                <label>
                    Simbolo
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className={styles.input}
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
                    Data Fine
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button onClick={handleSimulate} className={styles.button}>Simula Andamento</button>
            </div>

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

            {result && (
                <div className={styles.resultBox}>
                    <p>💵 Inizio: € {result.initial}</p>
                    <p>📈 Fine: € {result.final}</p>
                    <p>
                        📊 Variazione: <strong className={result.change >= 0 ? styles.positive : styles.negative}>
                            {result.change}%
                        </strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SimulationGraph;
