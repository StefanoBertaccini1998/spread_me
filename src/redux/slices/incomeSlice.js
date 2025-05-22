import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    addIncome: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
