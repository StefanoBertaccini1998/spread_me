// FinancialContext.js
import { createContext, useState, useContext } from 'react';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState({
        startValue: 0,
        categories: [],
        accounts: [],
    });

    const addTransaction = (transaction) => {
        setTransactions((prev) => [...prev, transaction]);
    };

    const updateSettings = (newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <FinancialContext.Provider value={{ transactions, addTransaction, settings, updateSettings }}>
            {children}
        </FinancialContext.Provider>
    );
};

export const useFinancial = () => useContext(FinancialContext);
