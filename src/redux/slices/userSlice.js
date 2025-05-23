import { createSlice } from '@reduxjs/toolkit';
import { authenticateUser } from '../asyncThunks/userThunks';

const initialState = {
  user: null,
  accounts: [],
  categories: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accounts = [];
      state.categories = [];
      state.error = null;
    },
    addAccountSetting: (state, action) => {
      state.accounts.push(action.payload);
    },
    addCategorySetting: (state, action) => {
      state.categories.push(action.payload);
    },
    removeAccountSetting: (state, action) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    removeCategorySetting: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const { user, accounts, categories } = action.payload;
        state.user = user;
        state.accounts = accounts;
        state.categories = categories;
        state.loading = false;
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Errore imprevisto';
      });
  }
});

export const {
  logoutUser,
  addAccountSetting,
  addCategorySetting,
  removeAccountSetting,
  removeCategorySetting
} = userSlice.actions;

export default userSlice.reducer;
