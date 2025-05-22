import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  income: [],
  transfers: []
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    addIncome: (state, action) => {
      state.income.push(action.payload);
    },
    addTransfer: (state, action) => {
      state.transfers.push(action.payload);
    }
  }
});

export const { addExpense, addIncome, addTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
