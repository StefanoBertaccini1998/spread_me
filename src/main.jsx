import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { IncomeProvider } from './context/IncomeContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { TransferProvider } from './context/TransferContext.jsx';
import { AccountProvider } from './context/AccountContext.jsx';
import { ExpenseCategoryProvider } from './context/ExpenseCategoryContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <AccountProvider>
          <ExpenseCategoryProvider>
            <ExpenseProvider>
              <IncomeProvider>
                <TransferProvider>
                  <App />
                </TransferProvider>
              </IncomeProvider>
            </ExpenseProvider>
          </ExpenseCategoryProvider>
        </AccountProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
)
