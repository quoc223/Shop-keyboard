import React from 'react';
import { Outlet } from 'react-router-dom';
import ResponsiveAppBar from "../header";
import Footer from "../footer";
import { Box } from '@mui/material';

const MainLayout = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <ResponsiveAppBar />
      <Box component="main" flex="1" p={3}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
