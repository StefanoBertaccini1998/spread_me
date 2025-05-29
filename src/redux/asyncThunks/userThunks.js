import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";

export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseURL}/users?email=${encodeURIComponent(email)}`
      );
      const existing = await res.json();

      const user = existing[0];
      if (!user) {
        return rejectWithValue("Nessun account trovato per questa email.");
      }

      const accRes = await fetch(`${baseURL}/accounts?userId=${user.id}`);
      const catRes = await fetch(`${baseURL}/categories?userId=${user.id}`);
      const accounts = await accRes.json();
      const categories = await catRes.json();

      return { user, accounts, categories };
    } catch (err) {
      return rejectWithValue("Errore durante l'autenticazione.");
    }
  }
);
