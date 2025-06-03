import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { loadStockData } from '../redux/asyncThunks/investmentThunks';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './InvestmentGraph.module.css';

const InvestmentGraph = () => {
    const dispatch = useAppDispatch();
    const { stockData, loading, error } = useAppSelector((state) => state.investment);

    useEffect(() => {
        dispatch(loadStockData('AAPL'));
    }, [dispatch]);

    return (
        <div className={styles.graphCard}>
            <h2 className={styles.graphTitle}>📊 Storico Apple (AAPL)</h2>
            {loading && <p>Caricamento dati...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stockData}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="close" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default InvestmentGraph;
