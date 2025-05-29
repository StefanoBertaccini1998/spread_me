import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";
import { addExpense, addIncome, addTransfer } from "../slices/transactionSlice";

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transaction, { getState }) => {
    const state = getState();
    const user = state.userSettings.user;

    console.log("Create TX", transaction);
    if (!user || !user.id) {
      throw new Error("Utente non autenticato");
    }

    const userId = user.id;
    const transactionWithUser = { ...transaction, userId };

    const response = await fetch(`${baseURL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionWithUser),
    });

    if (!response.ok) {
      throw new Error("Errore durante la creazione della transazione");
    }

    const saved = await response.json();

    return saved;
  }
);

// Fetch all transactions from the server
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState }) => {
    const state = getState();
    const user = state.userSettings.user;

    if (!user || !user.id) {
      throw new Error("Utente non autenticato");
    }

    const response = await fetch(`${baseURL}/transactions?userId=${user.id}`);
    if (!response.ok) {
      throw new Error("Errore durante il recupero delle transazioni");
    }

    return await response.json();
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/transactions/${transactionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      return transactionId;
    } catch (error) {
      return rejectWithValue("Errore durante la rimozione della transazione.");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (error) {
      return rejectWithValue(
        "Errore durante l’aggiornamento della transazione."
      );
    }
  }
);
