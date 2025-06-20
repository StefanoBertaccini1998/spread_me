import styles from './FinancialManagement.module.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TransactionView from './TransactionView';
import FilterBar from '../../components/FilterBar';
import Toast from '../../components/Toast';

// Central page for listing and editing financial transactions

const FinancialManagement = () => {
    // 1. dynamic route segment
    const { type = 'expenses' } = useParams();
    const view = type;                // ← 'expenses', 'incomes', etc.
    const navigate = useNavigate();
    const location = useLocation();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const stored = localStorage.getItem('financeFilters');
    const initialFilters =
        location.state?.filters || (stored ? JSON.parse(stored) : null) || {
            period: 'always',
            account: 'All',
            category: 'All',
            startDate: '',
            endDate: ''
        };
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        localStorage.setItem('financeFilters', JSON.stringify(filters));
    }, [filters]);

    // 3. modal handling
    useEffect(() => {
        const shouldOpen = new URLSearchParams(location.search)
            .get('openModal') === 'true';

        if (shouldOpen) {
            setModalOpen(true);
            setModalType(type);            // 'expenses' | 'incomes' | 'transfers'

            // after opening, drop the search-param to keep the URL tidy
            navigate(location.pathname, { replace: true });
        }
    }, [location.search, type, navigate]);   // ← correct deps

    const handleModalClose = () => {
        setModalOpen(false);
        setModalType(null);
    };
    // 4. switch handler
    const handleSectionChange = (newView) => {
        navigate(`/finance/${newView}`, { state: { filters } });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {view === 'expenses' && '📉 Gestione Spese'}
                {view === 'incomes' && '📈 Gestione Entrate'}
                {view === 'transfers' && '🔁 Gestione Trasferimenti'}
            </h1>
            <FilterBar filters={filters} setFilters={setFilters} />

            <div className={styles.menu}>
                <button className={`${styles.button} ${view === 'expenses' ? styles.active : ''}`} onClick={() => handleSectionChange('expenses')}>Spese</button>
                <button className={`${styles.button} ${view === 'incomes' ? styles.active : ''}`} onClick={() => handleSectionChange('incomes')}>Entrate</button>
                <button className={`${styles.button} ${view === 'transfers' ? styles.active : ''}`} onClick={() => handleSectionChange('transfers')}>Trasferimenti</button>
            </div>

            <TransactionView
                type={view}
                filters={filters}
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
