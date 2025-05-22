import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [
    { id: '1', name: 'Contanti', color: '#f87171', icon: '💵', balance: 0 },
    { id: '2', name: 'BPER', color: '#60a5fa', icon: '🏦', balance: 0 },
    { id: '3', name: 'Paypal', color: '#3b82f6', icon: '💳', balance: 0 }
  ],
  categories: [
    { id: '4', name: "Alimentari", color: "#60a5fa", icon: "🛒" },
    { id: '5', name: "Svago", color: "#f87171", icon: "🎉" },
    { id: '6', name: "Trasporti", color: "#34d399", icon: "🚗" },
    { id: '7', name: "Discoteca", color: "#c084fc", icon: "🎶" },
    { id: '8', name: "Regali", color: "#facc15", icon: "🎁" },
    { id: '9', name: "Vacanza", color: "#38bdf8", icon: "🏖️" }
  ]
};

const userSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
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
  }
});

export const {
  addAccountSetting,
  addCategorySetting,
  removeAccountSetting,
  removeCategorySetting
} = userSlice.actions;

export default userSlice.reducer;