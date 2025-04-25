import { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useIncome } from '../../context/IncomeContext';
import { useTransfers } from '../../context/TransferContext';
import {
    DEFAULT_ACCOUNTS,
    DEFAULT_EXPENSE_CATEGORIES,
    DEFAULT_INCOME_CATEGORIES
} from '../../constants/defaults';



const DynamicForm = ({ type, onClose, setToastMessage, setToastType }) => {
    const { addExpense } = useExpenses();
    const { addIncome } = useIncome();
    const { addTransfer } = useTransfers();
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        date: '',
        category: '',
        account: '',
        amountBaseCurrency: '',
        baseCurrency: 'EUR',
        comment: '',
        fromAccount: '',
        toAccount: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setToastType(type);
        if (type === 'expense') {
            if (!form.date || parseFloat(form.amountBaseCurrency) <= 0) {
                setError("Tutti i campi obbligatori devono essere validi.");
                return;
            }
            addExpense({
                date: form.date,
                category: form.category,
                account: form.account,
                amountBaseCurrency: parseFloat(form.amountBaseCurrency),
                baseCurrency: form.baseCurrency,
                amountAccountCurrency: parseFloat(form.amountBaseCurrency),
                accountCurrency: form.baseCurrency,
                amountTransactionCurrency: null,
                transactionCurrency: null,
                tag: null,
                comment: form.comment,
            });
            setToastMessage(
                type === 'expense' ? 'Spesa aggiunta!' :
                    type === 'income' ? 'Entrata salvata!' :
                        'Trasferimento registrato!'
            );
        } else if (type === 'income') {
            if (!form.date || parseFloat(form.amountBaseCurrency) <= 0) {
                setError("Tutti i campi obbligatori devono essere validi.");
                return;
            }
            addIncome({
                date: form.date,
                category: form.category,
                account: form.account,
                amountBaseCurrency: parseFloat(form.amountBaseCurrency),
                baseCurrency: form.baseCurrency,
                amountAccountCurrency: parseFloat(form.amountBaseCurrency),
                accountCurrency: form.baseCurrency,
                amountTransactionCurrency: null,
                transactionCurrency: null,
                tag: null,
                comment: form.comment,
            });
            setToastMessage(
                type === 'expense' ? 'Spesa aggiunta!' :
                    type === 'income' ? 'Entrata salvata!' :
                        'Trasferimento registrato!'
            );
        } else if (type === 'transfer') {
            if (!form.date || parseFloat(form.amountBaseCurrency) <= 0) {
                setError("Tutti i campi obbligatori devono essere validi.");
                return;
            }
            addTransfer({
                date: form.date,
                fromAccount: form.fromAccount,
                toAccount: form.toAccount,
                amountFromCurrency: parseFloat(form.amountBaseCurrency),
                fromCurrency: form.baseCurrency,
                amountToCurrency: null,
                toCurrency: null,
                comment: form.comment,
            });
            setToastMessage(
                type === 'expense' ? 'Spesa aggiunta!' :
                    type === 'income' ? 'Entrata salvata!' :
                        'Trasferimento registrato!'
            );
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label>Data</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" required />
            </div>
            {type !== 'transfer' && (
                <div>
                    <label>Categoria</label>
                    <select name="category" value={form.category} onChange={handleChange} className="styled-select" required>
                        <option value="">-- Seleziona --</option>
                        {(type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === 'transfer' ? (
                <>
                    <div>
                        <label>Conto di Uscita</label>
                        <select name="fromAccount" value={form.fromAccount} onChange={handleChange} className="styled-select" required>
                            <option value="">-- Seleziona --</option>
                            {DEFAULT_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Conto di Entrata</label>
                        <select name="toAccount" value={form.toAccount} onChange={handleChange} className="styled-select" required>
                            <option value="">-- Seleziona --</option>
                            {DEFAULT_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </select>
                    </div>
                </>
            ) : (
                <div>
                    <label>Conto</label>
                    <select name="account" value={form.account} onChange={handleChange} className="styled-select" required>
                        <option value="">-- Seleziona --</option>
                        {DEFAULT_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </select>
                </div>
            )}

            <div>
                <label>Importo</label>
                <input type="number" step="0.01" name="amountBaseCurrency" value={form.amountBaseCurrency} onChange={handleChange} className="input-field" required />
            </div>

            <div>
                <label>Valuta</label>
                <input type="text" name="baseCurrency" value={form.baseCurrency} onChange={handleChange} className="input-field" />
            </div>

            <div>
                <label>Commento</label>
                <textarea name="comment" value={form.comment} onChange={handleChange} className="input-field" />
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <div className="flex justify-end">
                <button type="submit" className="submit-button">Salva</button>
            </div>

        </form>

    );
};

export default DynamicForm;
