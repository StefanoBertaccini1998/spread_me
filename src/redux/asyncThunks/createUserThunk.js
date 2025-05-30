import { createAsyncThunk } from "@reduxjs/toolkit";
import { authenticateUser } from "../asyncThunks/userThunks";
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
      // Step 1: crea user
      const resCreate = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!resCreate.ok) throw new Error();
      const createdUser = await resCreate.json();

      const userId = createdUser.id;

      // Step 2: default Accounts
      const defaultAccounts = [
        { name: "Contanti", color: "#f87171", icon: "💵", balance: 0 },
        { name: "BPER", color: "#60a5fa", icon: "🏦", balance: 0 },
        { name: "Paypal", color: "#3b82f6", icon: "💳", balance: 0 },
      ];

      for (const acc of defaultAccounts) {
        await fetch(`${baseURL}/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...acc, userId }),
        });
      }

      // Step 3: default Categories
      const defaultCategories = [
        { name: "Alimentari", color: "#60a5fa", icon: "🛒" },
        { name: "Svago", color: "#f87171", icon: "🎉" },
        { name: "Trasporti", color: "#34d399", icon: "🚗" },
        { name: "Discoteca", color: "#c084fc", icon: "🎶" },
        { name: "Regali", color: "#facc15", icon: "🎁" },
        { name: "Vacanza", color: "#38bdf8", icon: "🏖️" },
      ];

      for (const cat of defaultCategories) {
        await fetch(`${baseURL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cat, userId }),
        });
      }

      return await dispatch(authenticateUser(createdUser.email)).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante la creazione dell’account."
      );
    }
  }
);
