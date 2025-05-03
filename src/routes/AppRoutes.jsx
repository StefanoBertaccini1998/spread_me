import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import FinancialManagement from '../pages/FinancialManagement/FinancialManagement';
import ImportPage from '../pages/ImportPage';
import DashboardHome from '../pages/DashboardHome';
import ProfilePage from '../pages/ProfilePage';
import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Pages */}
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="welcome" element={<Landing />} />

                {/* Protected Dashboard Pages */}
                <Route path="dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
                <Route path="finance" element={<ProtectedRoute><FinancialManagement /></ProtectedRoute>} />
                <Route path="finance/expenses" element={<ProtectedRoute><FinancialManagement section="expenses" /></ProtectedRoute>} />
                <Route path="finance/income" element={<ProtectedRoute><FinancialManagement section="income" /></ProtectedRoute>} />
                <Route path="finance/transfers" element={<ProtectedRoute><FinancialManagement section="transfers" /></ProtectedRoute>} />
                <Route path="import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
