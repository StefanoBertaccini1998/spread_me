import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../pages/layout/Layout';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import FinancialManagement from '../pages/FinancialManagement/FinancialManagement';
import ImportPage from '../pages/ImportPage';
import DashboardHome from '../pages/DashboardHome';
import ProfilePage from '../pages/ProfilePage';
import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';
import TransactionDetail from '../pages/FinancialManagement/TransactionDetail';
import InvestmentPage from '../pages/InvestmentPage';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Pages */}
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />

                {/* Protected Dashboard Pages */}
                <Route path="dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />

                {/* finance nested routes */}
                <Route
                    path="finance/:type?"
                    element={
                        <ProtectedRoute>
                            <FinancialManagement />
                        </ProtectedRoute>
                    }
                />

                <Route path="/transaction/:id" element={<TransactionDetail />} />

                <Route path="import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="investments" element={<ProtectedRoute><InvestmentPage /> </ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
