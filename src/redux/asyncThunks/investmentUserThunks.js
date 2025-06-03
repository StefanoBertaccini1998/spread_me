import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";

export const fetchUserInvestments = createAsyncThunk(
  "investments/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      if (!user?.id) throw new Error("Utente non autenticato");

      const res = await fetch(`${baseURL}/investments?userId=${user.id}`);
      if (!res.ok) throw new Error("Errore fetch investimenti");

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUserInvestment = createAsyncThunk(
  "investments/create",
  async (investment, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      if (!user?.id) throw new Error("Utente non autenticato");

      const payload = { ...investment, userId: user.id };
      const res = await fetch(`${baseURL}/investments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Errore creazione investimento");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserInvestment = createAsyncThunk(
  "investments/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/investments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Errore aggiornamento investimento");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUserInvestment = createAsyncThunk(
  "investments/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/investments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Errore eliminazione investimento");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
