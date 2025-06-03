import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/api";
import { adjustAccountBalance } from "../../utils/accountUpdateUtils";
import { updateAccountsBulk } from "./accountThunks";

// CREATE
export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (
    { transaction, skipBalanceUpdate = false },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const { user } = getState().userSettings;
      if (!user?.id) throw new Error("Utente non autenticato");
      const normalized = normalizeTransactionData(transaction);
      const transactionWithUser = { ...normalized, userId: user.id };
      const res = await fetch(`${baseURL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionWithUser),
      });

      if (!res.ok)
        throw new Error("Errore durante la creazione della transazione");

      const saved = await res.json();
      if (!skipBalanceUpdate) {
        const accounts = getState().accounts.data;
        const updatedAccounts = adjustAccountBalance(accounts, saved, "add");

        await dispatch(updateAccountsBulk(updatedAccounts)).unwrap(); // 👉 forza errore se fallisce
      }
      return saved;
    } catch (err) {
      console.error("Errore createTransaction:", err);
      return rejectWithValue(
        err.message || "Errore nella creazione transazione."
      );
    }
  }
);

// FETCH
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().userSettings;
      if (!user?.id) throw new Error("Utente non autenticato");

      const res = await fetch(`${baseURL}/transactions?userId=${user.id}`);
      if (!res.ok)
        throw new Error("Errore durante il recupero delle transazioni");

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || "Errore fetching transazioni.");
    }
  }
);

// DELETE
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const res = await fetch(`${baseURL}/transactions/${transactionId}`);
      if (!res.ok) throw new Error("Transazione non trovata");

      const transaction = await res.json();

      const updatedAccounts = adjustAccountBalance(
        state.accounts.data,
        transaction,
        "remove"
      );
      await dispatch(updateAccountsBulk(updatedAccounts)).unwrap();

      const deleteRes = await fetch(
        `${baseURL}/transactions/${transactionId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteRes.ok) throw new Error("Errore durante l'eliminazione");

      return transactionId;
    } catch (err) {
      console.error("Errore deleteTransaction:", err);
      return rejectWithValue(
        err.message || "Errore durante la rimozione della transazione."
      );
    }
  }
);

// UPDATE
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, updates }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();

      const resOld = await fetch(`${baseURL}/transactions/${id}`);
      if (!resOld.ok) throw new Error("Transazione precedente non trovata");
      const oldTx = await resOld.json();

      const resPatch = await fetch(`${baseURL}/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!resPatch.ok) throw new Error("Errore durante il patch");

      const updatedTx = await resPatch.json();

      let updatedAccounts = adjustAccountBalance(
        state.accounts.data,
        oldTx,
        "remove"
      );
      updatedAccounts = adjustAccountBalance(updatedAccounts, updatedTx, "add");

      await dispatch(updateAccountsBulk(updatedAccounts)).unwrap();

      return updatedTx;
    } catch (err) {
      console.error("Errore updateTransaction:", err);
      return rejectWithValue(
        err.message || "Errore durante l’aggiornamento della transazione."
      );
    }
  }
);

const normalizeTransactionData = (tx) => {
  const base = {
    category: tx.category || "",
    account: tx.account || "",
    amountBaseCurrency: tx.amountBaseCurrency ?? null,
    baseCurrency: tx.baseCurrency || "EUR",
    amountAccountCurrency: tx.amountAccountCurrency ?? null,
    accountCurrency: tx.accountCurrency || "EUR",
    comment: tx.comment || "",
    fromAccount: tx.fromAccount || "",
    toAccount: tx.toAccount || "",
    amountFromCurrency: tx.amountFromCurrency ?? null,
    fromCurrency: tx.fromCurrency || "EUR",
    toCurrency: tx.toCurrency || "EUR",
  };

  return {
    ...base,
    ...tx,
    type:
      tx.type === "income"
        ? "incomes"
        : tx.type === "expense"
        ? "expenses"
        : tx.type === "transfer"
        ? "transfers"
        : tx.type,
  };
};
