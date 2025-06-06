import { createSlice } from "@reduxjs/toolkit";
import { authenticateUser, createUser } from "../asyncThunks/userThunks";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  theme: "light",
  locale: "en-GB",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.role = "premium";
      }
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setLocale(state, action) {
      state.locale = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.loading = false;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore imprevisto";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logoutUser, upgradeToPremium } = userSlice.actions;

export default userSlice.reducer;
