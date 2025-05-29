import { createSlice } from "@reduxjs/toolkit";
import { authenticateUser } from "../asyncThunks/userThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accounts = [];
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.user = user;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore imprevisto";
      });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
