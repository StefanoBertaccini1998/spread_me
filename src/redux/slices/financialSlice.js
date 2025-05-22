import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  settings: {
    startValue: 0,
    categories: [],
    accounts: []
  }
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    }
  }
});

export const { addTransaction, updateSettings } = financialSlice.actions;
export default financialSlice.reducer;
