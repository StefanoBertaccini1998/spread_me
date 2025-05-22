import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: initialState, loading: false },
    reducers: {
        login: (state, action) => {
            const newUser = { email: action.payload };
            state.user = newUser;
            localStorage.setItem('user', JSON.stringify(newUser));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
