import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../asyncThunks/transactionThunks";

const initialState = {
  expenses: [],
  income: [],
  transfers: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createTransaction.fulfilled, (state, action) => {
        const tx = action.payload;
        if (tx.type === "expenses") state.expenses.push(tx);
        if (tx.type === "incomes") state.income.push(tx);
        if (tx.type === "transfers") state.transfers.push(tx);
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.expenses = action.payload.filter((t) => t.type === "expenses");
        state.income = action.payload.filter((t) => t.type === "incomes");
        state.transfers = action.payload.filter((t) => t.type === "transfers");
      })
      // DELETE
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((t) => t.id !== action.payload);
        state.income = state.income.filter((t) => t.id !== action.payload);
        state.transfers = state.transfers.filter(
          (t) => t.id !== action.payload
        );
      })
      // UPDATE
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const updated = action.payload;
        const type = updated.type;

        const groupMap = {
          expense: state.expenses,
          income: state.income,
          transfer: state.transfers,
        };

        const group = groupMap[type];
        const index = group.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          group[index] = updated;
        }
      });
  },
});

export const { addExpense, addIncome, addTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
