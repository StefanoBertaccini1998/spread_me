import styles from './FinancialManagement.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TransactionView from './TransactionView';
import FilterBar from '../../components/FilterBar';
import Toast from '../../components/Toast';

const FinancialManagement = ({ section }) => {
    const [view, setView] = useState(section ?? 'expenses');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const initialFilters = location.state?.filters || {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        category: 'All',
        account: 'All'
    };
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const typeFromUrl = queryParams.get('type');
        const shouldOpen = queryParams.get('openModal') === 'true';

        if (shouldOpen && typeFromUrl) {
            setView(typeFromUrl);
            setModalOpen(true);
            setModalType(typeFromUrl);

            // Rimuovi i query param dopo l'apertura del modale
            const cleanUrl = `/finance/${typeFromUrl}`;
            navigate(cleanUrl, { replace: true });

        }
    }, [location.search]);

    const handleModalClose = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleSectionChange = (newView) => {
        setView(newView);
        navigate(`/finance/${newView}`);
    };

    return (
        <div className={styles.container}>
            <FilterBar filters={filters} setFilters={setFilters} />

            <div className={styles.breadcrumb}>
                <a href="/dashboard" className={styles.breadcrumbLink}>Dashboard</a>
                {' / '} Gestione Finanze / {view === 'expenses' ? 'Spese' : view === 'income' ? 'Entrate' : 'Trasferimenti'}
            </div>

            <div className={styles.menu}>
                <button className={`${styles.button} ${view === 'expenses' ? styles.active : ''}`} onClick={() => handleSectionChange('expenses')}>Spese</button>
                <button className={`${styles.button} ${view === 'income' ? styles.active : ''}`} onClick={() => handleSectionChange('income')}>Entrate</button>
                <button className={`${styles.button} ${view === 'transfers' ? styles.active : ''}`} onClick={() => handleSectionChange('transfers')}>Trasferimenti</button>
            </div>

            <TransactionView
                type={view}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                openModal={modalOpen}
                modalType={modalType}
                onModalClose={handleModalClose}
            />

            {toastMessage && (
                <Toast message={toastMessage} type={toastType} onClose={() => {
                    setToastMessage('');
                    setToastType(null);
                }} />
            )}
        </div>
    );
};

export default FinancialManagement;
