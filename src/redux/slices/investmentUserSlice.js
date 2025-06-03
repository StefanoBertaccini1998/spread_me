import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserInvestments,
  createUserInvestment,
  updateUserInvestment,
  deleteUserInvestment,
} from "../asyncThunks/investmentUserThunks";

const userInvestmentsSlice = createSlice({
  name: "userInvestments",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInvestments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUserInvestment.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateUserInvestment.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteUserInvestment.fulfilled, (state, action) => {
        state.data = state.data.filter((inv) => inv.id !== action.payload);
      });
  },
});

export default userInvestmentsSlice.reducer;
