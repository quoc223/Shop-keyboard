import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Rating,
  TablePagination, IconButton, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, CircularProgress, Snackbar, Alert,
  Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent
} from '@mui/material';
import { Delete, Edit, Add, Refresh, Visibility } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/api';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReviewDetails, setSelectedReviewDetails] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    product_id: '',
    rating: 0,
    comment: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filterType, setFilterType] = useState('all');
  const [filterId, setFilterId] = useState('');
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});

  const fetchReviewDetails = async (reviewId) => {
    try {
      const response = await axios.get(`${API_URL}/reviews/${reviewId}`);
      setSelectedReviewDetails(response.data);
      setDetailDialogOpen(true);
    } catch (error) {
      showSnackbar('Failed to fetch review details', 'error');
    }
  };

  const handleResponseSubmit = async () => {
    try {
      // Assuming you have an API endpoint for submitting responses
      await axios.post(`${API_URL}/reviews/${selectedReviewDetails.id}/respond`, { response: responseText });
      showSnackbar('Response submitted successfully', 'success');
      setResponseText('');
      fetchReviewDetails(selectedReviewDetails.id); // Refresh the review details
    } catch (error) {
      showSnackbar('Failed to submit response', 'error');
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, filterType, filterId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/reviews?page=${page + 1}&limit=${rowsPerPage}`;
      if (filterType === 'product' && filterId) {
        url = `${API_URL}/products/${filterId}/reviews`;
      } else if (filterType === 'user' && filterId) {
        url = `${API_URL}/users/${filterId}/reviews`;
      }
      const response = await axios.get(url);
      const reviewsData = response.data.reviews || response.data;
      setReviews(reviewsData);
      setTotalCount(response.data.totalCount || reviewsData.length);

      // Fetch product and user details
      const productIds = [...new Set(reviewsData.map(review => review.product_id))];
      const userIds = [...new Set(reviewsData.map(review => review.user_id))];

      const productPromises = productIds.map(id => fetchProductDetails(id));
      const userPromises = userIds.map(id => fetchUserDetails(id));

      const productResults = await Promise.all(productPromises);
      const userResults = await Promise.all(userPromises);

      const newProducts = {};
      const newUsers = {};

      productResults.forEach(product => {
        if (product) newProducts[product.id] = product.name;
      });

      userResults.forEach(user => {
        if (user) newUsers[user.id] = user.name;
      });

      setProducts(newProducts);
      setUsers(newUsers);

    } catch (err) {
      setError('Failed to fetch reviews. Please try again.');
      showSnackbar('Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product details for ID ${productId}`, error);
      return null;
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user details for ID ${userId}`, error);
      return null;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode, review = null) => {
    setDialogMode(mode);
    setSelectedReview(review);
    if (mode === 'edit' && review) {
      setFormData({
        user_id: review.user_id,
        product_id: review.product_id,
        rating: review.rating,
        comment: review.comment
      });
    } else if (mode === 'create') {
      setFormData({
        user_id: '',
        product_id: '',
        rating: 0,
        comment: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setFormData({
      user_id: '',
      product_id: '',
      rating: 0,
      comment: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRatingChange = (newValue) => {
    setFormData(prevData => ({
      ...prevData,
      rating: newValue
    }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await axios.post(`${API_URL}/reviews`, formData);
        showSnackbar('Review created successfully', 'success');
      } else if (dialogMode === 'edit') {
        await axios.put(`${API_URL}/reviews/${selectedReview.id}`, formData);
        showSnackbar('Review updated successfully', 'success');
      } else if (dialogMode === 'delete') {
        await axios.delete(`${API_URL}/reviews/${selectedReview.id}`);
        showSnackbar('Review deleted successfully', 'success');
      }
      handleCloseDialog();
      fetchReviews();
    } catch (err) {
      showSnackbar(`Failed to ${dialogMode} review`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setFilterId('');
    setPage(0);
  };

  const handleFilterIdChange = (event) => {
    setFilterId(event.target.value);
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem' }}>
        Review Manager
      </Typography>

      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Filter By</InputLabel>
            <Select value={filterType} onChange={handleFilterChange}>
              <MenuItem value="all">All Reviews</MenuItem>
              <MenuItem value="product">By Product</MenuItem>
              <MenuItem value="user">By User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {filterType !== 'all' && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={filterType === 'product' ? 'Product ID' : 'User ID'}
              value={filterId}
              onChange={handleFilterIdChange}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={fetchReviews}
            fullWidth
          >
            Refresh
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog('create')}
        style={{ marginBottom: '1rem' }}
      >
        Add New Review
      </Button>

      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Product</TableCell>
          <TableCell>Rating</TableCell>
          <TableCell>Comment</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{review.user_name || review.user_id}</TableCell>
            <TableCell>{review.product_name || review.product_id}</TableCell>
            <TableCell>
              <Rating value={review.rating} readOnly />
            </TableCell>
            <TableCell>{review.comment}</TableCell>
            <TableCell>
              <IconButton onClick={() => fetchReviewDetails(review.id)} color="primary">
                <Visibility />
              </IconButton>
              <IconButton onClick={() => handleOpenDialog('edit', review)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleOpenDialog('delete', review)} color="error">
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Review' : 
           dialogMode === 'edit' ? 'Edit Review' : 'Delete Review'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <Typography>Are you sure you want to delete this review?</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  name="user_id"
                  label="User ID"
                  type="text"
                  value={formData.user_id}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  name="product_id"
                  label="Product ID"
                  type="text"
                  value={formData.product_id}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={(event, newValue) => handleRatingChange(newValue)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  name="comment"
                  label="Comment"
                  type="text"
                  multiline
                  rows={4}
                  value={formData.comment}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {dialogMode === 'create' ? 'Create' : 
             dialogMode === 'edit' ? 'Update' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} fullWidth maxWidth="md">
    <DialogTitle>Review Details</DialogTitle>
    <DialogContent>
      {selectedReviewDetails && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">User: {selectedReviewDetails.user_name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Product: {selectedReviewDetails.product_id}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Rating:</Typography>
            <Rating value={selectedReviewDetails.rating} readOnly />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Comment:</Typography>
            <Typography>{selectedReviewDetails.comment}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Respond to Review:</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleResponseSubmit}>
              Submit Response
            </Button>
          </Grid>
        </Grid>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewManager;