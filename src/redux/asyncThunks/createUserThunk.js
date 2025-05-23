import { createAsyncThunk } from '@reduxjs/toolkit';
import { authenticateUser } from '../asyncThunks/userThunks';
import baseURL from '../../utils/api';

export const createUser = createAsyncThunk(
  'auth/createUser',
  async (email, { dispatch, rejectWithValue }) => {
    try {
      // Verifica se l'utente esiste già
      const resCheck = await fetch(`${baseURL}/users?email=${email}`);
      const existing = await resCheck.json();

      if (existing.length > 0) {
        return rejectWithValue('Esiste già un account con questa email.');
      }
        const defaultAccounts = [
        { id: '1', name: 'Contanti', color: '#f87171', icon: '💵', balance: 0 },
        { id: '2', name: 'BPER', color: '#60a5fa', icon: '🏦', balance: 0 },
        { id: '3', name: 'Paypal', color: '#3b82f6', icon: '💳', balance: 0 }
        ];

        const defaultCategories = [
        { id: '4', name: "Alimentari", color: "#60a5fa", icon: "🛒" },
        { id: '5', name: "Svago", color: "#f87171", icon: "🎉" },
        { id: '6', name: "Trasporti", color: "#34d399", icon: "🚗" },
        { id: '7', name: "Discoteca", color: "#c084fc", icon: "🎶" },
        { id: '8', name: "Regali", color: "#facc15", icon: "🎁" },
        { id: '9', name: "Vacanza", color: "#38bdf8", icon: "🏖️" }
        ];
      // Crea nuovo utente
      const newUser = {
        email,
        accounts: defaultAccounts,
        categories: defaultCategories,
        transactions: []
      };

      const resCreate = await fetch(`${baseURL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!resCreate.ok) {
        throw new Error('Errore durante la creazione utente');
      }

      const createdUser = await resCreate.json();

      dispatch(authenticateUser(createdUser));
      return createdUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Errore durante la creazione dell’account.');
    }
  }
);
