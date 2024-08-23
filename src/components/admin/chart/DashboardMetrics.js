import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import OrderChart from './orderchart'; // Import OrderChart

function DashboardMetrics() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard/sales-data');
        const formattedData = response.data.map(item => ({
          month: item.month,
          total_income: parseFloat(item.total_income)
        }));
        setSalesData(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching sales data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={3} sx={{ mt: 2, mb: 2 }}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 , padding:8.8}}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Sales Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis  tickFormatter={(value) => `$${value}`}/>
                <Tooltip />
                <Bar dataKey="total_income" fill="#3f51b5" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Top Product sales
            </Typography>
            <OrderChart />
          </Box>
        </Paper>
      </Grid>
      
    </Grid>
    
  );
}

export default DashboardMetrics;
