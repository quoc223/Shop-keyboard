import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  DialogContent,
  DialogTitle,
  Typography, Dialog, DialogActions
} from '@mui/material';

function Profile() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    country: '',
  });

  const handleViewDetails = (orderId) => {
    axios.get(`http://localhost:3001/api/order/Alldatacust/${orderId}`)
      .then((response) => {
        const { orderInfo, orderItems } = response.data;
        setOrderDetails({
          ...orderInfo,
          orderItems: orderItems || [],
        });
        setShowOrderDetails(true);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setOrderDetails(null);
        setShowOrderDetails(false);
      });
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orderhistory');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/updateProfileByid/${user.id}`, user);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.put('http://localhost:3001/api/changepassword', { password });
      alert('Password changed successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/api/changeaddress', address);
      alert('Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Thông Tin Tài Khoản" />
                <Tab label="Lịch Sử Đặt Hàng" />
                <Tab label="Đổi Mật Khẩu" />
                <Tab label="Cập Nhật Địa Chỉ" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {value === 0 && (
                  <form onSubmit={handleUpdateProfile}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Name"
                      value={user.name || ''}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Email"
                      value={user.email || ''}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Phone"
                      value={user.phone || ''}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                     Cập Nhật
                    </Button>
                  </form>
                )}
                {value === 1 && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Ngày Đặt</TableCell>
                          <TableCell>Tổng Tiền</TableCell>
                          <TableCell>Trạng Thái</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>${order.total}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleViewDetails(order.id)}
                              >
                                Xem Chi Tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {value === 2 && (
                  <form onSubmit={handleChangePassword}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="New Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                      Đổi Mật Khẩu
                    </Button>
                  </form>
                )}
                {value === 3 && (
                  <form onSubmit={handleSubmitAddress}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Address Line 1"
                      name="address_line1"
                      value={address.address_line1}
                      onChange={handleAddressChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Address Line 2"
                      name="address_line2"
                      value={address.address_line2}
                      onChange={handleAddressChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="City"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                      Cập Nhật Địa Chỉ
                    </Button>
                  </form>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
       
              <Dialog
                open={showOrderDetails}
                onClose={handleCloseOrderDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {orderDetails ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Order ID: {orderDetails.order_id}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total: {orderDetails.total}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Created At: {orderDetails.created_at}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Updated At: {orderDetails.updated_at}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Status: {orderDetails.status}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Full Address: {orderDetails.full_address}
                                </Typography>
                                <Typography variant="subtitle1">
                                    User Name: {orderDetails.user_name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Email: {orderDetails.email}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Phone: {orderDetails.phone}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Is Default:{" "}
                                    {orderDetails.is_default ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {Array.isArray(orderDetails.orderItems) &&
                                orderDetails.orderItems.length > 0 ? (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Product Name
                                                </TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>
                                                    Total Price
                                                </TableCell>
                                                <TableCell>Rating</TableCell>
                                                <TableCell>Comment</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetails.orderItems.map(
                                                (item) => (
                                                    <TableRow
                                                        key={item.order_item_id}
                                                    >
                                                        <TableCell>
                                                            {item.product_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.price}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.total_price}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.rating}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.comment}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Typography variant="body1">
                                        No order items available.
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Rating: {orderDetails.rating}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Comment: {orderDetails.comment}
                                </Typography>
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography variant="body1">
                            Order details are not available.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseOrderDetails} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
      </Container>
    </Box>
  );
}

export default Profile;
