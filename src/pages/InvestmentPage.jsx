import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { useState } from 'react';
import { upgradeToPremium } from '../redux/slices/userSlice';
import TopAssetsSlider from '../components/TopAssetsSlider';
import InvestmentCalculator from '../components/InvestmentCalculator';
import SimulationGraph from '../components/SimulationGraph';
import MyInvestments from '../components/MyInvestments';
import styles from './InvestmentPage.module.css';

const InvestmentPage = () => {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const [showSuccess, setShowSuccess] = useState(false);

    if (!user) return null;

    if (user.role !== 'premium') {
        const handleUpgrade = () => {
            dispatch(upgradeToPremium());
            setShowSuccess(true);
        };

        return (
            <div className={styles.container}>
                <div className={styles.upgradeCard}>
                    <h2 className={styles.upgradeTitle}>🔒 Accesso riservato agli utenti Premium</h2>
                    <p className={styles.upgradeText}>
                        Ottieni l’accesso al Dashboard Investimenti con analisi, grafici e simulazioni!
                    </p>
                    <button className={styles.upgradeButton} onClick={handleUpgrade}>
                        Passa a Premium
                    </button>
                    {showSuccess && (
                        <p className={styles.successMessage}>
                            ✅ Upgrade effettuato! Benvenuto tra gli utenti Premium 🎉
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>📈 Investment Dashboard</h1>
            <TopAssetsSlider />
            <div className={styles.section}>
                <MyInvestments />
            </div>
            <div className={styles.section}>
                <InvestmentCalculator />
            </div>
            <div className={styles.section}>
                <SimulationGraph />
            </div>
        </div>
    );
};

export default InvestmentPage;
