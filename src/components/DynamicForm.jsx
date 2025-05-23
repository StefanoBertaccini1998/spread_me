import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { addExpense, addIncome, addTransfer } from '../redux/slices/transactionSlice';
import styles from './DynamicForm.module.css';

const DynamicForm = ({ type, onClose, setToastMessage, setToastType }) => {
    const dispatch = useAppDispatch();
    const { accounts, categories } = useAppSelector(state => state.userSettings);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: '',
        account: '',
        amountBaseCurrency: '',
        baseCurrency: 'EUR',
        comment: '',
        fromAccount: '',
        toAccount: '',
        amountFromCurrency: '',
        fromCurrency: 'EUR',
        toCurrency: 'EUR'
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = 'Campo obbligatorio';
        if (type !== 'transfer') {
            if (!formData.category) newErrors.category = 'Campo obbligatorio';
            if (!formData.account) newErrors.account = 'Campo obbligatorio';
            if (!formData.amountBaseCurrency || parseFloat(formData.amountBaseCurrency) <= 0) {
                newErrors.amountBaseCurrency = 'Importo obbligatorio e maggiore di 0';
            }
        } else {
            if (!formData.fromAccount) newErrors.fromAccount = 'Campo obbligatorio';
            if (!formData.toAccount) newErrors.toAccount = 'Campo obbligatorio';
            if (!formData.amountFromCurrency || parseFloat(formData.amountFromCurrency) <= 0) {
                newErrors.amountFromCurrency = 'Importo obbligatorio e maggiore di 0';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            amountBaseCurrency: parseFloat(formData.amountBaseCurrency),
            amountFromCurrency: parseFloat(formData.amountFromCurrency)
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
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={`${styles.input} ${errors.date ? styles['input-error'] : ''}`} />
            {errors.date && <div className={styles.error}>{errors.date}</div>}

            {type !== 'transfer' && (
                <>
                    <select name="category" value={formData.category} onChange={handleChange} className={`${styles.input} ${errors.category ? styles['input-error'] : ''}`}>
                        <option value="">-- Seleziona Categoria --</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    {errors.category && <div className={styles.error}>{errors.category}</div>}

                    <select name="account" value={formData.account} onChange={handleChange} className={`${styles.input} ${errors.account ? styles['input-error'] : ''}`}>
                        <option value="">-- Seleziona Account --</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.name}>{acc.name}</option>)}
                    </select>
                    {errors.account && <div className={styles.error}>{errors.account}</div>}

                    <input
                        type="number"
                        name="amountBaseCurrency"
                        placeholder="Importo"
                        value={formData.amountBaseCurrency}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.amountBaseCurrency ? styles['input-error'] : ''}`}
                    />{errors.amountBaseCurrency && <div className={styles.error}>{errors.amountBaseCurrency}</div>}
                </>
            )}

            {type === 'transfer' && (
                <>
                    <select name="fromAccount" value={formData.fromAccount} onChange={handleChange} className={`${styles.input} ${errors.fromAccount ? styles['input-error'] : ''}`}>
                        <option value="">-- Da Account --</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.name}>{acc.name}</option>)}
                    </select>
                    {errors.fromAccount && <div className={styles.error}>{errors.fromAccount}</div>}

                    <select name="toAccount" value={formData.toAccount} onChange={handleChange} className={`${styles.input} ${errors.toAccount ? styles['input-error'] : ''}`}>
                        <option value="">-- A Account --</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.name}>{acc.name}</option>)}
                    </select>
                    {errors.toAccount && <div className={styles.error}>{errors.toAccount}</div>}
                    <input
                        type="number"
                        name="amountFromCurrency"
                        placeholder="Importo"
                        value={formData.amountFromCurrency}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.amountFromCurrency ? styles['input-error'] : ''}`}
                    />{errors.amountFromCurrency && <div className={styles.error}>{errors.amountFromCurrency}</div>}
                </>
            )}

            <textarea name="comment" placeholder="Commento" value={formData.comment} onChange={handleChange} className={styles.textarea} />
            <button type="submit" className={styles.button}>Salva</button>
        </form>
    );
};

export default DynamicForm;
