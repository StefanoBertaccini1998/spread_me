import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
