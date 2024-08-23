import React, { useState, useEffect, useCallback } from 'react';

import { 
  Container, Typography, Grid, Paper, Button, Stepper,
  Step, StepLabel, TextField, Select, MenuItem, Box, IconButton, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const CartItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const steps = ['Giỏ Hàng', 'Địa Chỉ', 'Đánh Giá & Thanh Toán'];

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    country: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      showSnackbar('Error fetching cart items', 'error');
    }
  }, []);

  const fetchSavedAddresses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/shipping-addresses');
      setSavedAddresses(response.data);
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
      showSnackbar('Error fetching saved addresses', 'error');
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
    fetchSavedAddresses();
  }, [fetchCartItems, fetchSavedAddresses]);

  const handleQuantityChange = async (productId, change) => {
    try {
      const item = cartItems.find(item => item.product_id === productId);
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;

      await axios.put(`http://localhost:3001/api/updatecartitem/${item.id}`, {
        quantity: newQuantity
      });

      setCartItems(prevCart =>
        prevCart.map(item =>
          item.product_id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      showSnackbar('Error updating quantity', 'error');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const item = cartItems.find(item => item.product_id === productId);
      await axios.delete(`http://localhost:3001/api/deletecartitem/${item.id}`);

      setCartItems(prevCart => prevCart.filter(item => item.product_id !== productId));
      showSnackbar('Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showSnackbar('Error removing item', 'error');
    }
  };

  const handleAddressChange = (event) => {
    setShippingAddress({ ...shippingAddress, [event.target.name]: event.target.value });
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/checkout', {
        shippingAddress,
        cartItems,
      });
      console.log('Order created:', response.data);
      showSnackbar('Order placed successfully!', 'success');
      setCartItems([]); // Clear the cart after successful order
      setActiveStep(0); // Reset to the first step
    } catch (error) {
      console.error('Error creating order:', error);
      showSnackbar('Error placing order', 'error');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const renderCartItems = () => (
    <StyledPaper>
      {cartItems.map((item) => (
        <CartItem key={item.product_id}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{item.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>${item.price}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleQuantityChange(item.product_id, -1)} size="small">
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(item.product_id, 1)} size="small">
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleRemoveItem(item.product_id)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CartItem>
      ))}
      <Typography variant="h6" align="right">
        Tổng Tiền: ${cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
      </Typography>
    </StyledPaper>
  );

  const renderShippingAddress = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>Địa Chỉ</Typography>
      <Select
        value={shippingAddress.id || ''}
        onChange={(e) => setShippingAddress(savedAddresses.find(addr => addr.id === e.target.value) || {})}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">
          <em>Chọn địa chỉ hoặc nhập địa chỉ mới</em>
        </MenuItem>
        {savedAddresses.map((addr) => (
          <MenuItem key={addr.id} value={addr.id}>
            {`${addr.address_line1}, ${addr.city}, ${addr.country}`}
          </MenuItem>
        ))}
      </Select>
      <TextField
        name="address_line1"
        label="Address Line 1"
        value={shippingAddress.address_line1}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="address_line2"
        label="Address Line 2"
        value={shippingAddress.address_line2}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="city"
        label="City"
        value={shippingAddress.city}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="country"
        label="Country"
        value={shippingAddress.country}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
    </StyledPaper>
  );

  const renderReviewAndPay = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>Chi Tiết Đơn Hàng</Typography>
      {renderCartItems()}
      <Typography variant="subtitle1" gutterBottom>Địa Chỉ:</Typography>
      <Typography>
        {shippingAddress.address_line1}, {shippingAddress.address_line2 && `${shippingAddress.address_line2},`}
        {shippingAddress.city}, {shippingAddress.country}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        fullWidth
        style={{ marginTop: 20 }}
      >
        Đặt Hàng
      </Button>
    </StyledPaper>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartItems();
      case 1:
        return renderShippingAddress();
      case 2:
        return renderReviewAndPay();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Giỏ Hàng
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (activeStep === steps.length - 1) {
              handleCheckout();
            } else {
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
          }}
        >
          {activeStep === steps.length - 1 ? 'Đặt Hàng' : 'Next'}
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    
  );
}

export default ShoppingCart;