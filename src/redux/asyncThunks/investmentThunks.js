import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStockData, fetchHistoricalData } from "../../utils/investmentApi";

export const loadStockData = createAsyncThunk(
  "investment/loadStockData",
  async (symbol, { rejectWithValue }) => {
    try {
      const data = await fetchStockData(symbol);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Errore caricamento dati stock");
    }
  }
);

export const loadHistoricalData = createAsyncThunk(
  "investment/loadHistoricalData",
  async ({ symbol, startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await fetchHistoricalData(symbol, startDate, endDate);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Errore caricamento dati storici"
      );
    }
  }
);
