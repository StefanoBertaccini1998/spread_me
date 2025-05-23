import {configureStore} from '@reduxjs/toolkit'
import financialReducer from './slices/financialSlice';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';
import placeholderReducer from './slices/placeholderSlice';

export const store = configureStore({
    reducer: {
        placeholder: placeholderReducer,
        financial: financialReducer,
        userSettings: userReducer,
        transaction: transactionReducer
    },
   
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
