import { createSlice } from "@reduxjs/toolkit";
import {
  loadStockData,
  loadHistoricalData,
} from "../asyncThunks/investmentThunks";

const initialState = {
  stockData: [],
  historicalData: [],
  loading: false,
  error: null,
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.stockData = action.payload;
      })
      .addCase(loadStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadHistoricalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHistoricalData.fulfilled, (state, action) => {
        state.loading = false;
        state.historicalData = action.payload;
      })
      .addCase(loadHistoricalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default investmentSlice.reducer;
