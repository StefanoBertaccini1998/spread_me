import { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Modal from '../../components/Modal';
import DynamicForm from './DynamicForm';
import './ExpensesSection.css';

const ExpensesSection = () => {
    const { expenses } = useExpenses();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-container">
            <div className="expenses-header">
                <h1 className="expenses-title">Spese</h1>
                <button className="expenses-button" onClick={() => setIsModalOpen(true)}>➕ Aggiungi Spesa</button>
            </div>

            <ul className="expenses-list">
                {expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                        <li key={index} className="list-item">
                            {expense.datetime} - {expense.category} - {expense.account} - {expense.amountBaseCurrency} {expense.baseCurrency}
                        </li>
                    ))
                ) : (
                    <li>Nessuna spesa registrata.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DynamicForm type="expense" onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ExpensesSection;
