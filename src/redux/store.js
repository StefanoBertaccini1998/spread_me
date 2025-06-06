import financialReducer from "./slices/financialSlice";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import accountReducer from "./slices/accountSlice";
import categoriesReducer from "./slices/categoriesSlice";
import investmentReducer from "./slices/investmentSlice";
import investmentUserReducer from "./slices/investmentUserSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  financial: financialReducer,
  transaction: transactionReducer,
  accounts: accountReducer,
  categories: categoriesReducer,
  user: userReducer,
  investment: investmentReducer,
  investmentsUser: investmentUserReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "investment"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);
