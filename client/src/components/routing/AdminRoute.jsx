import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
