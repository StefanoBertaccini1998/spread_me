import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userSettings, setUserSettings] = useState({
        accounts: [
            { name: 'Contanti', color: '#f87171', icon: '💵' },
            { name: 'BPER', color: '#60a5fa', icon: '🏦' },
            { name: 'Paypal', color: '#3b82f6', icon: '💳' }
        ],
        categories: [
            { name: "Alimentari", color: "#60a5fa", icon: "🛒" },
            { name: "Svago", color: "#f87171", icon: "🎉" },
            { name: "Trasporti", color: "#34d399", icon: "🚗" },
            { name: "Discoteca", color: "#c084fc", icon: "🎶" },
            { name: "Regali", color: "#facc15", icon: "🎁" },
            { name: "Vacanza", color: "#38bdf8", icon: "🏖️" }
        ]
    });

    const addAccount = (account) => {
        setUserSettings(prev => ({
            ...prev,
            accounts: [...prev.accounts, account]
        }));
    };

    const addCategory = (category) => {
        setUserSettings(prev => ({
            ...prev,
            categories: [...prev.categories, category]
        }));
    };

    return (
        <UserContext.Provider value={{ userSettings, addAccount, addCategory }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
