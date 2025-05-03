// src/context/AccountContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ACCOUNTS } from '../constants/defaults';

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('accounts');
        return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    });

    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    const addAccount = (account) => {
        setAccounts((prev) => [...prev, account]);
    };

    const removeAccount = (accountName) => {
        setAccounts((prev) => prev.filter(acc => acc.name !== accountName));
    };

    return (
        <AccountContext.Provider value={{ accounts, addAccount, removeAccount }}>
            {children}
        </AccountContext.Provider>
    );
};
