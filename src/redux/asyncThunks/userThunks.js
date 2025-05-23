import { createAsyncThunk } from '@reduxjs/toolkit';
import baseURL from '../../utils/api';

export const authenticateUser = createAsyncThunk(
  'user/authenticateUser',
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/users?email=${encodeURIComponent(email)}`);
      const existing = await res.json();

      let user = existing[0];
      if (!user) {
        const createRes = await fetch(`${baseURL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        user = await createRes.json();
      }

      const accRes = await fetch(`${baseURL}/accounts?userId=${user.id}`);
      const catRes = await fetch(`${baseURL}/categories?userId=${user.id}`);
      const accounts = await accRes.json();
      const categories = await catRes.json();

      return { user, accounts, categories };
    } catch (err) {
      return rejectWithValue('Errore durante autenticazione');
    }
  }
);
