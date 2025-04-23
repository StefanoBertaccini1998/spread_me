import { createContext, useContext, useState } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([
        {
            datetime: "2024-12-30T00:00",
            category: "Barbiere",
            account: "Revolut",
            amountBaseCurrency: 20.00,
            baseCurrency: "EUR",
            amountAccountCurrency: 20.00,
            accountCurrency: "EUR",
            amountTransactionCurrency: null,
            transactionCurrency: null,
            tag: null,
            comment: ""
        }
    ]);

    const addExpense = (expense) => {
        setExpenses(prev => [...prev, expense]);
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
