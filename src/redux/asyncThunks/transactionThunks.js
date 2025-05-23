import { createAsyncThunk } from '@reduxjs/toolkit';
import baseURL from '../../utils/api';
import { addExpense, addIncome, addTransfer } from '../slices/transactionSlice';

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transaction, { dispatch, getState }) => {
    const state = getState();
    const user = state.userSettings.user;

    if (!user || !user.id) {
      throw new Error('Utente non autenticato');
    }

    const userId = user.id;
    const transactionWithUser = { ...transaction, userId };

    const response = await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionWithUser),
    });

    if (!response.ok) {
      throw new Error('Errore durante la creazione della transazione');
    }

    const saved = await response.json();

    switch (saved.type) {
      case 'expense':
        dispatch(addExpense(saved));
        break;
      case 'income':
        dispatch(addIncome(saved));
        break;
      case 'transfer':
        dispatch(addTransfer(saved));
        break;
      default:
        break;
    }

    return saved;
  }
);


// Fetch all transactions from the server
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { getState }) => {
    const state = getState();
    const user = state.userSettings.user;

    if (!user || !user.id) {
      throw new Error('Utente non autenticato');
    }

    const response = await fetch(`${baseURL}/transactions?userId=${user.id}`);
    if (!response.ok) {
      throw new Error('Errore durante il recupero delle transazioni');
    }

    return await response.json();
  }
);
