import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../asyncThunks/categoryThunks";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCategorySetting: (state, action) => {
      state.data.push(action.payload);
    },
    removeCategorySetting: (state, action) => {
      state.data = state.data.filter((cat) => cat.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((cat) => cat.id !== action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export const { addCategorySetting, removeCategorySetting } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
