// src/components/admin/DashboardLayout.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import AppBar1 from './AppBar';
import Sidebar from './sidebar';
import useAuth from './authentication/useAuth'; // Đảm bảo đường dẫn này chính xác

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-dashboard" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar1 />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DashboardLayout;