import {configureStore} from '@reduxjs/toolkit'
import expenseCategoryReducer from './slices/expenseCategorySlice';
import expenseReducer from './slices/expenseSlice';
import incomeReducer from './slices/incomeSlice';
import transferReducer from './slices/transferSlice';
import financialReducer from './slices/financialSlice';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';
import accountReducer from './slices/accountSlice';
import authReducer from './slices/authSlice';
import placeholderReducer from './slices/placeholderSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        auth: authReducer,
        placeholder: placeholderReducer,
        expenseCategory: expenseCategoryReducer,
        expenses: expenseReducer,
        income: incomeReducer,
        transfers: transferReducer,
        financial: financialReducer,
        userSettings: userReducer,
        transaction: transactionReducer
    },
});
