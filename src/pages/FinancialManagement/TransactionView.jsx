import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks/useRedux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import DynamicForm from '../../components/DynamicForm';
import styles from './TransactionView.module.css';

const labels = {
    expenses: 'Spese',
    incomes: 'Entrate',
    transfers: 'Trasferimenti'
};

const TransactionView = ({ type, setToastMessage, setToastType, openModal, modalType, onModalClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const data = useAppSelector((state) => state.transaction[type]);
    const transaction = useAppSelector((state) => state.transaction);
    useEffect(() => {
        setIsModalOpen(openModal && modalType === type);
    }, [openModal, modalType, type]);

    const handleClick = (id) => {
        navigate(`/transaction/${id}`, { state: { from: type } });
    };

    const formatAmount = (amount, currency) =>
        new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: currency || 'EUR'
        }).format(parseFloat(amount));

    const formatLine = (entry) => {
        if (type === 'transfers') {
            return (
                <div className={styles.content}>
                    <div className={styles.topLine}>
                        <span className={styles.date}>{entry.date}</span>
                        <span className={styles.amountTransfer}>{formatAmount(entry.amountFromCurrency, entry.fromCurrency)}</span>
                    </div>
                    <div className={styles.bottomLine}>
                        <span className={styles.badge}>{entry.fromAccount}</span>
                        <span className={styles.arrow}>➡️</span>
                        <span className={styles.badge}>{entry.toAccount}</span>
                    </div>
                </div>
            );
        } else {
            const isExpense = type === 'expenses';
            return (
                <div className={styles.content}>
                    <div className={styles.topLine}>
                        <span className={styles.date}>{entry.date}</span>
                        <span className={isExpense ? styles.amountNegative : styles.amountPositive}>
                            {isExpense ? '-' : '+'}{formatAmount(entry.amountBaseCurrency, entry.baseCurrency)}
                        </span>
                    </div>
                    <div className={styles.bottomLine}>
                        <span className={styles.badge}>{entry.category}</span>
                        <span className={styles.badge}>{entry.account}</span>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h1 className={styles[`${type}-title`]}>{labels[type]}</h1>
                <button
                    className={styles[`${type}-button`]}
                    onClick={() => setIsModalOpen(true)}
                >
                    ➕ Aggiungi
                </button>
            </div>

            <ul className={styles.list}>
                {data.map((entry) => (
                    <li key={entry.id} className={styles.item} onClick={() => handleClick(entry.id)}>
                        {formatLine(entry)}
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                onModalClose?.();
            }} type={type}>
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
