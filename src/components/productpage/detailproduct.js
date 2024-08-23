import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Grid, Typography, Button, Card, CardMedia, CircularProgress,
  Alert, TextField, Box, Divider, Paper, Rating, List, ListItem, ListItemText, Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { StyledPaginate } from '../homepage/StyledComponents';

// Styled components
const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 400,
  backgroundSize: 'contain',
  margin: theme.spacing(2),
}));

const ProductInfo = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const ReviewList = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

function DetailProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/product/${productId}`),
          axios.get(`http://localhost:3001/api/reviews/${productId}`)
        ]);
        if (!productResponse.data) {
          throw new Error('Product not found');
        }
        setProduct(productResponse.data);
        
        // Handle both single review object and array of reviews
        const reviewsData = reviewsResponse.data;
        setReviews(Array.isArray(reviewsData) ? reviewsData : [reviewsData].filter(Boolean));
      } catch (err) {
        setError(err.message || 'Error fetching product details and reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [productId]);

  useEffect(() => {
    setPageCount(Math.ceil(reviews.length / itemsPerPage));
  }, [reviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/api/reviews/${productId}`, {
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        withCredentials: true
      });
      setReviews(prevReviews => [...prevReviews, response.data]);
      setNewReview({ rating: 0, comment: '' });
      showSnackbar('Review submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showSnackbar('Error submitting review', 'error');
    }
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const addCart = async () => {
    try {
      await axios.post('http://localhost:3001/api/addtocart', {
        productId: product.id,
        quantity: quantity
      }, {
        withCredentials: true
      });
      showSnackbar('Product added to cart', 'success');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showSnackbar('Error adding product to cart', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1));
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <ProductImage
                component="img"
                alt={product.name}
                image={product.imageUrl}
              />
            </Card>
          </Grid>
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <ProductInfo elevation={3}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Rating value={product.averageRating || 0} readOnly precision={0.5} />
              <Divider sx={{ my: 2 }} />
              <PriceTypography variant="h5" component="p">
                ${formatPrice(product.price)}
              </PriceTypography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 100, mr: 2 }}
                />
                <Typography variant="body2">
                 Còn {product.stock} Sản Phẩm
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={addCart}
                startIcon={<AddShoppingCartIcon />}
                fullWidth
              >
                Thêm Vào Giỏ
              </Button>
            </ProductInfo>
          </Grid>
        </Grid>
        {/* Reviews Section */}
        <Box my={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Bình Luận
          </Typography>
          <ReviewList>
            <List>
              {currentItems.map((review) => (
                <ListItem key={review.id}>
                  <ListItemText
                    primary={
                      <>
                       <Typography variant="body2" color="textSecondary">
                        {review.user_name}
                      </Typography>
                        <Rating value={review.rating} readOnly />
                        <Typography variant="body2">{review.comment}</Typography>
                      </>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </ReviewList>
          {reviews.length > itemsPerPage && (
            <StyledPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              forcePage={currentPage}
            />
          )}
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
             Viết Bình Luận
            </Typography>
            <Rating
              name="rating"
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
            />
            <TextField
              fullWidth
              name="comment"
              label="Your Comment"
              multiline
              rows={4}
              value={newReview.comment}
              onChange={handleReviewChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Đăng Bình Luận
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DetailProduct;