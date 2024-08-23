import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import MainLayout from './components/homepage/homelayout';
import Homepage from './components/homepage/index';
import DetailProduct from './components/productpage/detailproduct';
import LoginPage from './components/authentication/login';
import ShoppingCart from './components/productpage/shopingcart';
import ProductCategory from './components/productpage/productcategory';
import RegisterPage from './components/authentication/register';
import DashboardLayout from './components/admin/DashboardLayout';
import LoginDashboard from './components/admin/authentication/login';
import ProtectedRoute from './components/admin/authentication/ProtectedRoute';
import ProtectedRouteCustomer from './components/authentication/ProtectedRoute';
import Dashboard from './components/admin/admin';
import ManagerProduct from './components/admin/managerproduct';
import ManagerOrder from './components/admin/managerorder';
import Profile from './components/authentication/profile';
import ManagerUser from './components/admin/manageruser';
import ManagerBlog from './components/admin/managerblog';
import ManagerReview from './components/admin/managerreview';
// Styles
import './App.css';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box 
        display="flex" 
        flexDirection="column" 
        minHeight="100vh"
      >
        <Box component="main" flex="1">
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Homepage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login-dashboard" element={<LoginDashboard />} />

            {/* Protected customer routes */}
            <Route element={<ProtectedRouteCustomer />}>
           
              <Route element={<MainLayout />}>
                <Route path="/products/category/:categoryId" element={<ProductCategory />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/product/:productId" element={<DetailProduct />} />  
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="product" element={<ManagerProduct />} />
                <Route path="order" element={<ManagerOrder />} />
                <Route path="user" element={<ManagerUser />} />
                <Route path="blog" element={<ManagerBlog />} />
                <Route path="review" element={<ManagerReview />} />
              </Route>
            </Route>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
