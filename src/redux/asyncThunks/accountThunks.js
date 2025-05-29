import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().userSettings.user?.id;
      if (!userId) throw new Error("Utente non autenticato");
      const res = await fetch(`${baseURL}/accounts?userId=${userId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue("Errore durante il fetch degli account.");
    }
  }
);

export const createAccount = createAsyncThunk(
  "categories/createAccount",
  async (account, { getState, rejectWithValue }) => {
    try {
      const userId = getState().userSettings.user?.id;
      if (!userId) throw new Error("Utente non autenticato");

      const res = await fetch(`${baseURL}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...account, userId }),
      });

      if (!res.ok) throw new Error();
      return await res.json();
    } catch (error) {
      return rejectWithValue("Errore durante la creazione della categoria.");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/accounts/${accountId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      return accountId;
    } catch (error) {
      return rejectWithValue("Errore durante l’eliminazione dell’account.");
    }
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (error) {
      return rejectWithValue("Errore durante l’aggiornamento dell’account.");
    }
  }
);
