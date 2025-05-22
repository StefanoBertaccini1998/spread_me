import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { addExpense, addIncome, addTransfer } from '../redux/slices/transactionSlice';
import styles from './DynamicForm.module.css';

const DynamicForm = ({ type, onClose, setToastMessage, setToastType }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: '',
        account: '',
        amountBaseCurrency: '',
        baseCurrency: 'EUR',
        comment: '',
        ...(type === 'transfer' && { fromAccount: '', toAccount: '', amountFromCurrency: '', fromCurrency: 'EUR', toCurrency: 'EUR' })
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            amountBaseCurrency: parseFloat(formData.amountBaseCurrency),
            ...(type === 'transfer' && { amountFromCurrency: parseFloat(formData.amountFromCurrency) })
        };

        switch (type) {
            case 'expense':
                dispatch(addExpense(payload));
                break;
            case 'income':
                dispatch(addIncome(payload));
                break;
            case 'transfer':
                dispatch(addTransfer(payload));
                break;
            default:
                break;
        }

        setToastMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} aggiunto con successo!`);
        setToastType('success');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={styles.input} />
            {type !== 'transfer' && (
                <>
                    <input type="text" name="category" placeholder="Categoria" value={formData.category} onChange={handleChange} className={styles.input} />
                    <input type="text" name="account" placeholder="Account" value={formData.account} onChange={handleChange} className={styles.input} />
                    <input type="number" name="amountBaseCurrency" placeholder="Importo" value={formData.amountBaseCurrency} onChange={handleChange} className={styles.input} />
                </>
            )}
            {type === 'transfer' && (
                <>
                    <input type="text" name="fromAccount" placeholder="Da" value={formData.fromAccount} onChange={handleChange} className={styles.input} />
                    <input type="text" name="toAccount" placeholder="A" value={formData.toAccount} onChange={handleChange} className={styles.input} />
                    <input type="number" name="amountFromCurrency" placeholder="Importo" value={formData.amountFromCurrency} onChange={handleChange} className={styles.input} />
                </>
            )}
            <textarea name="comment" placeholder="Commento" value={formData.comment} onChange={handleChange} className={styles.textarea} />
            <button type="submit" className={styles.button}>Salva</button>
        </form>
    );
};

export default DynamicForm;