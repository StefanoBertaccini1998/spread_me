import { createSlice } from '@reduxjs/toolkit';
import { fetchTransactions } from '../asyncThunks/transactionThunks';

const initialState = {
  expenses: [],
  income: [],
  transfers: []
};

const transactionSlice = createSlice({
  name: 'transactions',
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.expenses = action.payload.filter(t => t.type === 'expense');
      state.income = action.payload.filter(t => t.type === 'income');
      state.transfers = action.payload.filter(t => t.type === 'transfer');
    });
  }
});

export const { addExpense, addIncome, addTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
