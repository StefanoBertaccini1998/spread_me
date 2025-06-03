import { createSlice } from "@reduxjs/toolkit";
import { authenticateUser, createUser } from "../asyncThunks/userThunks";

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
      state.error = null;
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.role = "premium";
      }
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
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      });
  },
});

export const { logoutUser, upgradeToPremium } = userSlice.actions;

export default userSlice.reducer;
