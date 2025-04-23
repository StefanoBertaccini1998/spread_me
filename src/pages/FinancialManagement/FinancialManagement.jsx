import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExpensesSection from './ExpensesSection';
import IncomeSection from './IncomeSection';
import TransfersSection from './TransfersSection';
import './FinancialManagement.css';

const FinancialManagement = ({ section }) => {
    const [view, setView] = useState(section ? section : 'expenses');
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
                return <ExpensesSection />;
            case 'income':
                return <IncomeSection />;
            case 'transfers':
                return <TransfersSection />;
            default:
                return <ExpensesSection />;
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
        </div>
    );
};

export default FinancialManagement;
