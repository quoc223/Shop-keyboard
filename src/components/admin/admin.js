import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  createTheme,
  ThemeProvider,
  LinearProgress 
} from '@mui/material';
import Chart from "../admin/chart";
import LatestUpdates from './lateupdate';
import DashboardMetrics from './chart/DashboardMetrics';
import useAuth from './authentication/useAuth';
import { Navigate } from 'react-router-dom';
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const getChangeColor = (percentChange) => {
  if (percentChange === null) return 'text.secondary';
  return parseFloat(percentChange) < 0 ? 'error.main' : 'success.main';
};
const getArrowDirection = (percentChange) => {
  if (percentChange === null) return '→'; // Default arrow for no data
  return parseFloat(percentChange) < 0 ? '↓' : '↑';
};
function Dashboard() {
  const [salesData, setSalesData] = useState(0);
  const [purchaseChange, setPurchaseChange] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [salesResponse, purchaseResponse] = await Promise.all([
            axios.get('http://localhost:3001/api/dashboard/sales-data', { withCredentials: true }),
            axios.get('http://localhost:3001/api/get-user-purchase-change', { withCredentials: true })
          ]);

          const totalAnnualIncome = salesResponse.data.reduce((acc, item) => acc + parseFloat(item.total_income), 0);
          setSalesData(totalAnnualIncome);
          setPurchaseChange(purchaseResponse.data);
          setLoading(false);
        } catch (err) {
          setError('Error fetching data');
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading) return <LinearProgress />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <Typography>Loading dashboard data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Your existing grid items */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3}>
              <Box p={2}>
                <Typography variant="subtitle2">TOTAL PROFIT</Typography>
                <Typography variant="h4">{formatter.format(salesData)}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
        <Paper>
          <Box p={2}>
            <Typography variant="subtitle2">TOTAL CUSTOMERS</Typography>
            <Typography variant="h4">{purchaseChange.CurrentMonthUsers}</Typography>
            <Typography variant="body2" color={getChangeColor(purchaseChange?.PercentChange)}>{purchaseChange ? `${getArrowDirection(purchaseChange.PercentChange)} ${Math.abs(purchaseChange.PercentChange)}% Since last month` : 'No data'}</Typography>
          </Box>
        </Paper>
      </Grid>
          {/* Add more grid items for other metrics */}
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <DashboardMetrics />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Stock Analytics</Typography>
              <Chart />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Latest Updates</Typography>
              <LatestUpdates />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;