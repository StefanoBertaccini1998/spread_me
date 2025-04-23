import { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useIncome } from '../../context/IncomeContext';
import { useTransfers } from '../../context/TransferContext';

const DynamicForm = ({ type, onClose }) => {
    const { addExpense } = useExpenses();
    const { addIncome } = useIncome();
    const { addTransfer } = useTransfers();

    const [form, setForm] = useState({
        datetime: '',
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

        if (type === 'expense') {
            addExpense({
                datetime: form.datetime,
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
        } else if (type === 'income') {
            addIncome({
                datetime: form.datetime,
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
        } else if (type === 'transfer') {
            addTransfer({
                datetime: form.datetime,
                fromAccount: form.fromAccount,
                toAccount: form.toAccount,
                amountFromCurrency: parseFloat(form.amountBaseCurrency),
                fromCurrency: form.baseCurrency,
                amountToCurrency: null,
                toCurrency: null,
                comment: form.comment,
            });
        }

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Data e Ora</label>
                <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} className="input-field" required />
            </div>
            {type !== 'transfer' ? (
                <>
                    <div>
                        <label className="block mb-1">Categoria</label>
                        <input type="text" name="category" value={form.category} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                        <label className="block mb-1">Conto</label>
                        <input type="text" name="account" value={form.account} onChange={handleChange} className="input-field" required />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label className="block mb-1">Conto di Uscita</label>
                        <input type="text" name="fromAccount" value={form.fromAccount} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                        <label className="block mb-1">Conto di Entrata</label>
                        <input type="text" name="toAccount" value={form.toAccount} onChange={handleChange} className="input-field" required />
                    </div>
                </>
            )}
            <div>
                <label className="block mb-1">Importo</label>
                <input type="number" step="0.01" name="amountBaseCurrency" value={form.amountBaseCurrency} onChange={handleChange} className="input-field" required />
            </div>
            <div>
                <label className="block mb-1">Valuta</label>
                <input type="text" name="baseCurrency" value={form.baseCurrency} onChange={handleChange} className="input-field" />
            </div>
            <div>
                <label className="block mb-1">Commento</label>
                <textarea name="comment" value={form.comment} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex justify-end">
                <button type="submit" className="submit-button">Salva</button>
            </div>
        </form>
    );
};

export default DynamicForm;
