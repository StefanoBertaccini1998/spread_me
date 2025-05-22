import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_ACCOUNTS } from '../../constants/defaults';

const initialState = JSON.parse(localStorage.getItem('accounts')) || DEFAULT_ACCOUNTS;

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        addAccount: (state, action) => {
            state.push(action.payload);
            localStorage.setItem('accounts', JSON.stringify(state));
        },
        removeAccount: (state, action) => {
            const filtered = state.filter(acc => acc.name !== action.payload);
            localStorage.setItem('accounts', JSON.stringify(filtered));
            return filtered;
        },
    },
});

export const { addAccount, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;
