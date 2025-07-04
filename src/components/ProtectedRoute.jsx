import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.user);

    if (!user && !loading) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;