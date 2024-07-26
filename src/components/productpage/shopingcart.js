import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch API data and update cartItems state
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/order');
        
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleCheckout = () => {
    // Xử lý logic thanh toán ở đây
    console.log('Thanh toán giỏ hàng:', cartItems);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <List>
        {cartItems.map((item) => (
          <StyledListItem key={item.id}>
            <ListItemText primary="Quantity" secondary={item.quantity} />
            <ListItemText primary="totalPrice" secondary={`$${item.totalPrice}`}  />
            <ListItemText primary="status" secondary={item.status} />
          </StyledListItem>
        ))}
      </List>
      <StyledButton variant="contained" color="primary" onClick={handleCheckout}>
        Checkout
      </StyledButton>
    </StyledContainer>
  );
};

export default ShoppingCart;