import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Container, Grid, Typography, Button, Card, CardMedia, CircularProgress, Alert,TextField } from '@mui/material';
import User from '../../models/user';

const useStyles = styled((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

function DetailProduct() {
  const classes = useStyles();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Khởi tạo số lượng ban đầu là 1
  const [userid, setUserid]=useState(1);
  // Các state và logic khác
  const generateNewUserId = () => {
    const newUserId = userid;
    setUserid(userid + 1); // Tăng userId lên 1 cho lần tiếp theo
    return newUserId;
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/product/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  const handleAddToCart = async () => {
    const orderData = {
      userId: User._id||generateNewUserId(), // Replace with actual user ID
      productId: product?._id, // Use optional chaining to handle undefined product
      orderDate: new Date().toISOString(),
      quantity,
      totalPrice: product?.price * quantity, // Use optional chaining to handle undefined product.price
      status: ['confirmed']
    };
  
    try {
      const response = await axios.post('http://localhost:3001/api/neworder', orderData);
      if (response && response.data) {
        console.log('Order created successfully:', response.data);
        // Redirect or show a success message
      } else {
        console.error('Error creating order: Unexpected response from server');
      }
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
          <CardMedia component="img" alt={product.name} loading="lazy" height="40%" image={product.imageUrl}/>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Price: ${product.price}
          </Typography>
          
          <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          InputProps={{ inputProps: { min: 1 } }}
        />
          
          <Typography variant="body1" paragraph>
            Stock: {product.stock}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddToCart}>
            Add to Cart 
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DetailProduct;
