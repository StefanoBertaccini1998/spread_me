import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { IncomeProvider } from './context/IncomeContext';
import { TransferProvider } from './context/TransferContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <IncomeProvider>
          <TransferProvider>
            <AppRoutes />
          </TransferProvider>
        </IncomeProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
