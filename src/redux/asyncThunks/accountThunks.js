import { createAsyncThunk } from '@reduxjs/toolkit';
import baseURL from '../../utils/api';

export const fetchAccounts = createAsyncThunk(
  'user/fetchAccounts',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/users/${userId}`);
      const user = await res.json();
      return user.accounts || [];
    } catch (error) {
      return rejectWithValue('Errore durante il fetch degli account.');
    }
  }
);

export const createAccount = createAsyncThunk(
  'user/createAccount',
  async ({ userId, account }, { rejectWithValue }) => {
    try {
      const userRes = await fetch(`${baseURL}/users/${userId}`);
      const user = await userRes.json();
      const updatedAccounts = [...(user.accounts || []), account];

      const updateRes = await fetch(`${baseURL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: updatedAccounts })
      });

      if (!updateRes.ok) throw new Error();
      return account;
    } catch (error) {
      return rejectWithValue('Errore durante la creazione dell’account.');
    }
  }
);
