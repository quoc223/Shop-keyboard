import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './authcustomer'; // Đảm bảo đường dẫn này chính xác

const ProtectedRouteCustome = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    // Consider displaying a loading indicator
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle errors appropriately
    console.error('Authentication error:', error);
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteCustome;