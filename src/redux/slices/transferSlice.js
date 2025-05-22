import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const transferSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    addTransfer: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addTransfer } = transferSlice.actions;
export default transferSlice.reducer;
