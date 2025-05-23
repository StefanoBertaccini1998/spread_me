import { createAsyncThunk } from '@reduxjs/toolkit';
import baseURL from '../../utils/api';

export const fetchCategories = createAsyncThunk(
  'user/fetchCategories',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/users/${userId}`);
      const user = await res.json();
      return user.categories || [];
    } catch (error) {
      return rejectWithValue('Errore durante il fetch delle categorie.');
    }
  }
);

export const createCategory = createAsyncThunk(
  'user/createCategory',
  async ({ userId, category }, { rejectWithValue }) => {
    try {
      const userRes = await fetch(`${baseURL}/users/${userId}`);
      const user = await userRes.json();
      const updatedCategories = [...(user.categories || []), category];

      const updateRes = await fetch(`${baseURL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCategories })
      });

      if (!updateRes.ok) throw new Error();
      return category;
    } catch (error) {
      return rejectWithValue('Errore durante la creazione della categoria.');
    }
  }
);
