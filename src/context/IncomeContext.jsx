import { createContext, useContext, useState } from 'react';

const IncomeContext = createContext();

export const useIncome = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
    const [income, setIncome] = useState([
        {
            date: "2024-12-28",
            category: "Regalo",
            account: "Contanti",
            amountBaseCurrency: 100.00,
            baseCurrency: "EUR",
            amountAccountCurrency: 100.00,
            accountCurrency: "EUR",
            amountTransactionCurrency: null,
            transactionCurrency: null,
            tag: null,
            comment: ""
        }
    ]);

    const addIncome = (entry) => {
        setIncome(prev => [...prev, entry]);
    };

    return (
        <IncomeContext.Provider value={{ income, addIncome }}>
            {children}
        </IncomeContext.Provider>
    );
};
