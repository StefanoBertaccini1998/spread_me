import { useEffect, useState } from 'react';
import { fetchTopAssets } from '../utils/investmentApi';
import styles from './TopAssetsSlider.module.css';

const TopAssetsSlider = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = localStorage.getItem('topAssets');
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
                setAssets(data);
                setLoading(false);
                console.log("No retry")
                return;
            }
        }
        console.log("Fetching")
        fetchTopAssets()
            .then((data) => {
                const slice = data.slice(0, 15);
                setAssets(slice);
                localStorage.setItem(
                    'topAssets',
                    JSON.stringify({ timestamp: Date.now(), data: slice })
                );
                setLoading(false);
            })
            .catch((err) => {
                console.error('Errore caricamento ETF:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.loading}>Caricamento ETF...</div>;

    return (
        <div className={styles.sliderWrapper}>
            <h2 className={styles.sliderTitle}>🌍 Migliori ETF / Stock</h2>
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
