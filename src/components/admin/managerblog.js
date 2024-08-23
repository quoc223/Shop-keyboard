import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const ManagerBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', description: '', urlImage: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showSnackbar('Failed to fetch blogs');
    }
  };

  const handleOpenDialog = (blog = { title: '', description: '', urlImage: '' }) => {
    setCurrentBlog(blog);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBlog({ title: '', description: '', urlImage: '' });
  };

  const handleInputChange = (e) => {
    setCurrentBlog({ ...currentBlog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (currentBlog.id) {
        await axios.put(`http://localhost:3001/api/blogs/${currentBlog.id}`, currentBlog);
        showSnackbar('Blog updated successfully');
      } else {
        await axios.post('/api/blogs', currentBlog);
        showSnackbar('Blog created successfully');
      }
      fetchBlogs();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving blog:', error);
      showSnackbar('Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:3001/api/blogs/${id}`);
        fetchBlogs();
        showSnackbar('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        showSnackbar('Failed to delete blog');
      }
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" align="center">
        Blog Manager
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Add New Blog
      </Button>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4}>
            <StyledCard>
              <StyledCardMedia
                image={blog.urlImage}
                title={blog.title}
              />
              <StyledCardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {blog.title}
                </Typography>
                <Typography>
                  {blog.description}
                </Typography>
              </StyledCardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(blog)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(blog.id)} color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentBlog.id ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBlog.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={currentBlog.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="urlImage"
            label="Image URL"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBlog.urlImage}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ManagerBlog;