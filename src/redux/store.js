import { configureStore } from "@reduxjs/toolkit";
import financialReducer from "./slices/financialSlice";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import placeholderReducer from "./slices/placeholderSlice";
import accountReducer from "./slices/accountSlice";
import categoriesReducer from "./slices/categoriesSlice";

export const store = configureStore(
  {
    reducer: {
      placeholder: placeholderReducer,
      financial: financialReducer,
      userSettings: userReducer,
      transaction: transactionReducer,
      accounts: accountReducer,
      categories: categoriesReducer,
      user: userReducer,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
