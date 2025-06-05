import { configureStore } from "@reduxjs/toolkit";
import financialReducer from "./slices/financialSlice";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import placeholderReducer from "./slices/placeholderSlice";
import accountReducer from "./slices/accountSlice";
import categoriesReducer from "./slices/categoriesSlice";
import investmentReducer from "./slices/investmentSlice";
import investmentUserReducer from "./slices/investmentUserSlice";

export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer,
    financial: financialReducer,
    transaction: transactionReducer,
    accounts: accountReducer,
    categories: categoriesReducer,
    user: userReducer,
    investment: investmentReducer,
    investmentsUser: investmentUserReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
