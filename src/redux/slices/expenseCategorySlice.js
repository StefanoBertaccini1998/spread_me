import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_EXPENSE_CATEGORIES } from '../../constants/defaults';

const initialState = JSON.parse(localStorage.getItem('expenseCategories')) || DEFAULT_EXPENSE_CATEGORIES;

const expenseCategorySlice = createSlice({
  name: 'expenseCategory',
  initialState,
  reducers: {
    addExpenseCategory: (state, action) => {
      state.push(action.payload);
      localStorage.setItem('expenseCategories', JSON.stringify(state));
    },
    removeExpenseCategory: (state, action) => {
      const updated = state.filter(cat => cat.name !== action.payload);
      localStorage.setItem('expenseCategories', JSON.stringify(updated));
      return updated;
    }
  }
});

export const { addExpenseCategory, removeExpenseCategory } = expenseCategorySlice.actions;
export default expenseCategorySlice.reducer;
