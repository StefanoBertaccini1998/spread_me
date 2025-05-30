import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { createTransaction, updateTransaction } from '../redux/asyncThunks/transactionThunks';
import styles from './DynamicForm.module.css';

const DynamicForm = ({ type, onClose, setToastMessage, setToastType, editData = null, disabled = false }) => {
    const dispatch = useAppDispatch();
    const accounts = useAppSelector((state) => state.accounts.data);
    const categories = useAppSelector((state) => state.categories.data);

    const [formData, setFormData] = useState(() => {
        if (editData) {
            return {
                date: editData.date || '',
                category: editData.category || '',
                account: editData.account || '',
                amountBaseCurrency: editData.amountBaseCurrency || '',
                baseCurrency: editData.baseCurrency || 'EUR',
                comment: editData.comment || '',
                fromAccount: editData.fromAccount || '',
                toAccount: editData.toAccount || '',
                amountFromCurrency: editData.amountFromCurrency || '',
                fromCurrency: editData.fromCurrency || 'EUR',
                toCurrency: editData.toCurrency || 'EUR',
            };
        }

        return {
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
        };
    });


    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        const amountBase = parseFloat(formData.amountBaseCurrency);
        const amountFrom = parseFloat(formData.amountFromCurrency);

        const selectedAccount = accounts.find(acc => acc.name === formData.account);
        const selectedFromAccount = accounts.find(acc => acc.name === formData.fromAccount);

        if (!formData.date) newErrors.date = 'Campo obbligatorio';

        if (type !== 'transfers') {
            if (!formData.category) newErrors.category = 'Campo obbligatorio';
            if (!formData.account) newErrors.account = 'Campo obbligatorio';

            if (!amountBase || amountBase <= 0) {
                newErrors.amountBaseCurrency = 'Importo obbligatorio e maggiore di 0';
            } else if (
                type === 'expenses' &&
                selectedAccount &&
                amountBase > selectedAccount.balance
            ) {
                newErrors.amountBaseCurrency = 'Saldo insufficiente sull’account selezionato';
            }
        } else {
            if (!formData.fromAccount) newErrors.fromAccount = 'Campo obbligatorio';
            if (!formData.toAccount) newErrors.toAccount = 'Campo obbligatorio';

            if (!amountFrom || amountFrom <= 0) {
                newErrors.amountFromCurrency = 'Importo obbligatorio e maggiore di 0';
            } else if (selectedFromAccount && amountFrom > selectedFromAccount.balance) {
                newErrors.amountFromCurrency = 'Saldo insufficiente sull’account di partenza';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            type,
            amountBaseCurrency: parseFloat(formData.amountBaseCurrency),
            amountFromCurrency: parseFloat(formData.amountFromCurrency)
        };

        try {
            if (editData && editData.id) {

                await dispatch(updateTransaction({ id: editData.id, updates: payload })).unwrap();
                setToastMessage('Transazione modificata con successo!');

            } else {

                await dispatch(createTransaction(payload)).unwrap();
                setToastMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} aggiunto con successo!`);
            }
            setToastType('success');
            onClose();
        } catch (error) {
            setToastMessage('Errore durante la creazione della transazione.');
            setToastType('error');
        }
    };


    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Data</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                disabled={disabled}
                onChange={handleChange}
                className={`${styles.input} ${errors.date ? styles['input-error'] : ''}`}
            />
            {errors.date && <div className={styles.error}>{errors.date}</div>}

            {type !== 'transfers' && (
                <>
                    <label className={styles.label}>Categoria</label>
                    <select
                        name="category"
                        value={formData.category}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.category ? styles['input-error'] : ''}`}
                    >
                        <option value="">-- Seleziona Categoria --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <div className={styles.error}>{errors.category}</div>}

                    <label className={styles.label}>Conti</label>
                    <select
                        name="account"
                        value={formData.account}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.account ? styles['input-error'] : ''}`}
                    >
                        <option value="">-- Seleziona Conto --</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.name}>
                                {acc.icon} {acc.name} - €{acc.balance.toFixed(2)}
                            </option>
                        ))}
                    </select>
                    {errors.account && <div className={styles.error}>{errors.account}</div>}

                    <label className={styles.label}>Importo</label>
                    <input
                        type="number"
                        name="amountBaseCurrency"
                        placeholder="Importo"
                        value={formData.amountBaseCurrency}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.amountBaseCurrency ? styles['input-error'] : ''}`}
                    />
                    {errors.amountBaseCurrency && <div className={styles.error}>{errors.amountBaseCurrency}</div>}
                </>
            )}

            {type === 'transfers' && (
                <>
                    <label className={styles.label}>Da Conto</label>
                    <select
                        name="fromAccount"
                        value={formData.fromAccount}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.fromAccount ? styles['input-error'] : ''}`}
                    >
                        <option value="">-- Seleziona --</option>
                        {accounts
                            .filter(acc => acc.name !== formData.toAccount)
                            .map(acc => (
                                <option key={acc.id} value={acc.name}>
                                    {acc.icon} {acc.name} – €{acc.balance.toFixed(2)}
                                </option>
                            ))}
                    </select>
                    {errors.fromAccount && <div className={styles.error}>{errors.fromAccount}</div>}

                    <label className={styles.label}>A Conto</label>
                    <select
                        name="toAccount"
                        value={formData.toAccount}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.toAccount ? styles['input-error'] : ''}`}
                    >
                        <option value="">-- Seleziona --</option>
                        {accounts
                            .filter(acc => acc.name !== formData.fromAccount)
                            .map(acc => (
                                <option key={acc.id} value={acc.name}>
                                    {acc.icon} {acc.name} – €{acc.balance.toFixed(2)}
                                </option>
                            ))}
                    </select>
                    {errors.toAccount && <div className={styles.error}>{errors.toAccount}</div>}

                    <label className={styles.label}>Importo</label>
                    <input
                        type="number"
                        name="amountFromCurrency"
                        placeholder="Importo"
                        value={formData.amountFromCurrency}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.amountFromCurrency ? styles['input-error'] : ''}`}
                    />
                    {errors.amountFromCurrency && <div className={styles.error}>{errors.amountFromCurrency}</div>}
                </>
            )}

            <label className={styles.label}>Commento</label>
            <textarea
                name="comment"
                placeholder="Commento"
                value={formData.comment}
                disabled={disabled}
                onChange={handleChange}
                className={styles.textarea}
            />

            {!disabled && (
                <button type="submit" className={styles.button}>
                    Salva
                </button>
            )}
        </form>
    );
};

export default DynamicForm;
