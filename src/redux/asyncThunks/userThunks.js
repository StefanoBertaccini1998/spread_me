import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (email, { dispatch, rejectWithValue }) => {
    try {
      // Verifica se l'utente esiste già
      const resCheck = await fetch(`${baseURL}/users?email=${email}`);
      const existing = await resCheck.json();
      if (existing.length > 0) {
        return rejectWithValue("Esiste già un account con questa email.");
      }

      // Step 1: crea utente
      const resCreate = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "basic" }),
      });
      if (!resCreate.ok) throw new Error("Errore creazione utente.");
      const createdUser = await resCreate.json();
      const userId = createdUser.id;

      // Step 2: crea default account
      const defaultAccounts = [
        { name: "Contanti", color: "#f87171", icon: "💵", balance: 0 },
        { name: "Banca", color: "#60a5fa", icon: "🏦", balance: 0 },
        { name: "SmartBank", color: "#3b82f6", icon: "💳", balance: 0 },
      ];

      for (const acc of defaultAccounts) {
        const res = await fetch(`${baseURL}/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...acc, userId }),
        });
        if (!res.ok) throw new Error(`Errore creazione account: ${acc.name}`);
      }

      // Step 3: crea default categorie
      const defaultCategories = [
        { name: "Alimentari", color: "#60a5fa", icon: "🛒" },
        { name: "Svago", color: "#f87171", icon: "🎉" },
        { name: "Trasporti", color: "#34d399", icon: "🚗" },
        { name: "Discoteca", color: "#c084fc", icon: "🎶" },
        { name: "Regali", color: "#facc15", icon: "🎁" },
        { name: "Vacanza", color: "#38bdf8", icon: "🏖️" },
      ];

      for (const cat of defaultCategories) {
        const res = await fetch(`${baseURL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cat, userId }),
        });
        if (!res.ok) throw new Error(`Errore creazione categoria: ${cat.name}`);
      }

      // Autenticazione finale
      return await retryAuthenticate(createdUser.email, dispatch);
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante la creazione dell’account."
      );
    }
  }
);

const retryAuthenticate = async (email, dispatch, retries = 5, delay = 200) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await dispatch(authenticateUser(email)).unwrap();
      if (result?.user) return result;
    } catch (err) {
      console.warn("Retry authentication attempt failed:", err);
    }
    await new Promise((res) => setTimeout(res, delay * (attempt + 1)));
  }
  throw new Error("Impossibile autenticare l'utente appena creato.");
};

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
      const token = btoa(`${user.id}-${Date.now()}`);

      return { user, token, accounts, categories };
    } catch (err) {
      return rejectWithValue(err.message || "Errore durante l'autenticazione.");
    }
  }
);
