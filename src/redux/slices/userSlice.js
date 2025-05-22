import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [
    { name: 'Contanti', color: '#f87171', icon: '💵' },
    { name: 'BPER', color: '#60a5fa', icon: '🏦' },
    { name: 'Paypal', color: '#3b82f6', icon: '💳' }
  ],
  categories: [
    { name: "Alimentari", color: "#60a5fa", icon: "🛒" },
    { name: "Svago", color: "#f87171", icon: "🎉" },
    { name: "Trasporti", color: "#34d399", icon: "🚗" },
    { name: "Discoteca", color: "#c084fc", icon: "🎶" },
    { name: "Regali", color: "#facc15", icon: "🎁" },
    { name: "Vacanza", color: "#38bdf8", icon: "🏖️" }
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
    }
  }
});

export const { addAccountSetting, addCategorySetting } = userSlice.actions;
export default userSlice.reducer;
