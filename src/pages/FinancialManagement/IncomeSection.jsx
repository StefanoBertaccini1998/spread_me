import { useState } from 'react';
import { useIncome } from '../../context/IncomeContext';
import Modal from '../../components/Modal';
import './IncomeSection.css';

const IncomeSection = ({ setToastMessage, setToastType }) => {
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
                            {entry.date} - {entry.category} - {entry.account} - {entry.amountBaseCurrency} {entry.baseCurrency}
                        </li>
                    ))
                ) : (
                    <li>Nessuna entrata registrata.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type="income">
                <DynamicForm type="income" onClose={() => setIsModalOpen(false)} setToastMessage={setToastMessage} setToastType={setToastType} />
            </Modal>
        </div>
    );
};

export default IncomeSection;
