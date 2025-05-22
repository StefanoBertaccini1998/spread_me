import { useState } from 'react';
import styles from './TransactionView.module.css';
import { useAppSelector } from '../../redux/hooks/useRedux';
import Modal from '../../components/Modal';
import DynamicForm from './DynamicForm';

const labels = {
    expenses: 'Spese',
    income: 'Entrate',
    transfers: 'Trasferimenti'
};

const TransactionView = ({ type, setToastMessage, setToastType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const data = useAppSelector(state => state.transaction[type]);

    const formatLine = (entry) => {
        if (type === 'transfers') {
            return `${entry.date} - Da ${entry.fromAccount} ➡️ A ${entry.toAccount} - ${entry.amountFromCurrency} ${entry.fromCurrency}`;
        } else {
            return `${entry.date} - ${entry.category} - ${entry.account} - ${entry.amountBaseCurrency} ${entry.baseCurrency}`;
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h1 className={styles.title}>{labels[type]}</h1>
                <button className={styles.button} onClick={() => setIsModalOpen(true)}>➕ Aggiungi</button>
            </div>

            <ul className={styles.list}>
                {data.length > 0 ? (
                    data.map((entry, index) => <li key={index} className={styles.item}>{formatLine(entry)}</li>)
                ) : (
                    <li>Nessuna {labels[type].toLowerCase()} registrata.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={type}>
                <DynamicForm
                    type={type}
                    onClose={() => setIsModalOpen(false)}
                    setToastMessage={setToastMessage}
                    setToastType={setToastType}
                />
            </Modal>
        </div>
    );
};

export default TransactionView;
