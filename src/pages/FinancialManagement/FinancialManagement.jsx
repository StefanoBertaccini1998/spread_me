import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExpensesSection from './ExpensesSection';
import IncomeSection from './IncomeSection';
import TransfersSection from './TransfersSection';
import './FinancialManagement.css';
import Toast from '../../components/Toast';

const FinancialManagement = ({ section }) => {
    const [view, setView] = useState(section ? section : 'expenses');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (section) {
            setView(section);
        }
    }, [section]);

    const handleSectionChange = (newView) => {
        setView(newView);
        navigate(`/finance/${newView}`);
    };

    const renderSection = () => {
        switch (view) {
            case 'expenses':
                return <ExpensesSection setToastMessage={setToastMessage} setToastType={setToastType} />;
            case 'income':
                return <IncomeSection setToastMessage={setToastMessage} setToastType={setToastType} />;
            case 'transfers':
                return <TransfersSection setToastMessage={setToastMessage} setToastType={setToastType} />;
            default:
                return <ExpensesSection setToastMessage={setToastMessage} setToastType={setToastType} />;
        }
    };

    return (
        <div className="finance-container">
            <div className="breadcrumb">
                <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link> / Gestione Finanze / {view === 'expenses' ? 'Spese' : view === 'income' ? 'Entrate' : 'Trasferimenti'}
            </div>

            <div className="finance-menu">
                <button className={`finance-button ${view === 'expenses' ? 'active' : ''}`} onClick={() => handleSectionChange('expenses')}>Spese</button>
                <button className={`finance-button ${view === 'income' ? 'active' : ''}`} onClick={() => handleSectionChange('income')}>Entrate</button>
                <button className={`finance-button ${view === 'transfers' ? 'active' : ''}`} onClick={() => handleSectionChange('transfers')}>Trasferimenti</button>
            </div>

            <div className="finance-content">
                {renderSection()}
            </div>
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
