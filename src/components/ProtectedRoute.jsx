import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;