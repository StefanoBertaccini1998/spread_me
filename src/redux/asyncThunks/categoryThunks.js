import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.user?.id;
      if (!userId) throw new Error("Utente non autenticato");

      const res = await fetch(`${baseURL}/categories?userId=${userId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante il fetch delle categorie."
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (category, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.user?.id;
      if (!userId) throw new Error("Utente non autenticato");

      const res = await fetch(`${baseURL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...category, userId }),
      });

      if (!res.ok) throw new Error();
      return await res.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante la creazione della categoria."
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante l’eliminazione della categoria."
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseURL}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore durante l’aggiornamento della categoria."
      );
    }
  }
);
