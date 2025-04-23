import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import FinancialManagement from '../pages/FinancialManagement/FinancialManagement';


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Landing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="finance" element={
                        <ProtectedRoute>
                            <FinancialManagement />
                        </ProtectedRoute>
                    } />
                    <Route path="finance/expenses" element={
                        <ProtectedRoute>
                            <FinancialManagement section={"expenses"} />
                        </ProtectedRoute>
                    } />
                    <Route path="finance/income" element={
                        <ProtectedRoute>
                            <FinancialManagement section={"income"} />
                        </ProtectedRoute>
                    } />
                    <Route path="finance/transfers" element={
                        <ProtectedRoute>
                            <FinancialManagement section={"transfers"} />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
