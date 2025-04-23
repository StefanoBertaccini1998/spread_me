import { useState } from 'react';
import { useIncome } from '../../context/IncomeContext';
import Modal from '../../components/Modal';
import DynamicForm from './DynamicForm';
import './IncomeSection.css';

const IncomeSection = () => {
    const { income } = useIncome();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-container">
            <div className="income-header">
                <h1 className="income-title">Entrate</h1>
                <button className="income-button" onClick={() => setIsModalOpen(true)}>➕ Aggiungi Entrata</button>
            </div>

            <ul className="income-list">
                {income.length > 0 ? (
                    income.map((entry, index) => (
                        <li key={index} className="list-item">
                            {entry.datetime} - {entry.category} - {entry.account} - {entry.amountBaseCurrency} {entry.baseCurrency}
                        </li>
                    ))
                ) : (
                    <li>Nessuna entrata registrata.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DynamicForm type="income" onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default IncomeSection;
