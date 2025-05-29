import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../asyncThunks/accountThunks";

const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    addAccountSetting: (state, action) => {
      state.data.push(action.payload);
    },
    removeAccountSetting: (state, action) => {
      state.data = state.data.filter((acc) => acc.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (acc) => acc.id === action.payload.id
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.data = state.data.filter((acc) => acc.id !== action.payload);
      });
  },
});

export const { addAccountSetting, removeAccountSetting } =
  accountsSlice.actions;
export default accountsSlice.reducer;
