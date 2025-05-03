// src/context/ExpenseCategoryContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_EXPENSE_CATEGORIES } from '../constants/defaults';

const ExpenseCategoryContext = createContext();

export const useExpenseCategory = () => useContext(ExpenseCategoryContext);

export const ExpenseCategoryProvider = ({ children }) => {
    const [expenseCategories, setExpenseCategories] = useState(() => {
        const saved = localStorage.getItem('expenseCategories');
        return saved ? JSON.parse(saved) : DEFAULT_EXPENSE_CATEGORIES;
    });

    useEffect(() => {
        localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
    }, [expenseCategories]);

    const addExpenseCategory = (category) => {
        setExpenseCategories((prev) => [...prev, category]);
    };

    const removeExpenseCategory = (categoryName) => {
        setExpenseCategories((prev) => prev.filter(cat => cat.name !== categoryName));
    };

    return (
        <ExpenseCategoryContext.Provider value={{ expenseCategories, addExpenseCategory, removeExpenseCategory }}>
            {children}
        </ExpenseCategoryContext.Provider>
    );
};
