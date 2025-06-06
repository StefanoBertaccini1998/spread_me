import { useEffect, useState } from 'react';
import { fetchTopAssets, fetchTopAssetsPeriod } from '../utils/investmentApi';
import styles from './TopAssetsSlider.module.css';

const TopAssetsSlider = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('day');

    useEffect(() => {
        const cacheKey = `topAssets-${period}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
                setAssets(data);
                setLoading(false);
                return;
            }
        }
        const fetchFn = period === 'day' ? fetchTopAssets : fetchTopAssetsPeriod;

        fetchFn(period)
            .then((data) => {
                const slice = data.slice(0, 15);
                setAssets(slice);
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ timestamp: Date.now(), data: slice })
                );
                setLoading(false);
            })
            .catch((err) => {
                console.error('Errore caricamento ETF:', err);
                setLoading(false);
            });
    }, [period]);

    if (loading) return <div className={styles.loading}>Caricamento ETF...</div>;

    return (
        <div className={styles.sliderWrapper}>
            <div className={styles.header}>
                <h2 className={styles.sliderTitle}>🌍 Migliori ETF / Stock</h2>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className={styles.select}
                >
                    <option value="day">Oggi</option>
                    <option value="week">Ultima Settimana</option>
                    <option value="month">Ultimo Mese</option>
                </select>
            </div>
            <div className={styles.slider}>
                {assets.map((asset) => (
                    <div key={asset.symbol} className={styles.assetCard}>
                        <div className={styles.symbol}>{asset.symbol}</div>
                        <div className={styles.name}>{asset.name}</div>
                        <div className={asset.changePercent >= 0 ? styles.positive : styles.negative}>
                            {asset.changePercent.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopAssetsSlider;
