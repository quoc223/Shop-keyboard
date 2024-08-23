import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Grid, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, Typography, Avatar, Select,
  MenuItem, FormControl, InputLabel, Card, CardContent, CardMedia, TablePagination
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
    
  Search as SearchIcon,
} from '@mui/icons-material';
const API_URL = 'http://localhost:3001/api/newproduct';
const LIST_API_URL = 'http://localhost:3001/api/product';
// const API_UPDATE_URL = 'http://localhost:3001/product/update/:productId';
// const API_DELETE_URL = 'http://localhost:3001/product/delete/:productId';
const categories = [
  { id: 1, name: 'Keyboard' },
  { id: 2, name: 'Keycap' },
  { id: 3, name: 'Mouse' },
  { id: 4, name: 'Switch' },
  { id: 5, name: 'Accessory' }
];

function ManagerProduct() {
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
   // Adjust as needed
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    imageUrl: '',
    brand: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

 

  const fetchProducts = () => {
    axios.get(LIST_API_URL).then((response) => {
      setProducts(response.data);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAdd = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl) {
      const newProduct = { ...product, imageUrl };
      axios.post(API_URL, newProduct).then(() => {
        fetchProducts();
        resetForm();
      });
    } else {
      console.error('Image upload failed');
    }
  };

  const handleUpdate = async () => {
    let imageUrl = product.imageUrl;
    if (selectedFile) {
      imageUrl = await uploadImage();
    }
    if (imageUrl) {
      const updatedProduct = { ...product, imageUrl };
      try {
        await axios.put(`http://localhost:3001/api/product/update/${product.id}`, updatedProduct);
        fetchProducts();
        resetForm();
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.error('Image upload failed');
    }
  };
  
  const handleDelete = (id) => {
    try {
      axios.delete(`http://localhost:3001/api/product/delete/${id}`).then(() => {
        fetchProducts();
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      brand: '',
      category_id: '',
      stock: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditing(false);
  };

  const handleEdit = (productToEdit) => {
    setProduct(productToEdit);
    setPreviewUrl(productToEdit.imageUrl);
    setIsEditing(true);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredUsers = products.filter((order) => {
    const searchLower = search.toLowerCase();
    return (
      (order.name?.toLowerCase().includes(searchLower) || '') ||
      (order.description?.toLowerCase().includes(searchLower) || '') 
      
    );
  });

  return (
    <Container maxWidth="lg">
       <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
      <Typography variant="h4" style={{ margin: '20px 0' }}>Product Management</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Product' : 'Add New Product'}</Typography>
              <TextField
                name="name"
                label="Name"
                value={product.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="description"
                label="Description"
                value={product.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="price"
                label="Price"
                value={product.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
              />
              <TextField
                name="brand"
                label="Brand"
                value={product.brand}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="stock"
                label="Stock"
                value={product.stock}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
              />

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  style={{ marginTop: '10px' }}
                >
                  Upload Image
                </Button>
              </label>
              {previewUrl && (
                <CardMedia
                  component="img"
                  alt="Product Image"
                  image={previewUrl}
                  style={{ height: 200, marginTop: '10px' }}
                />
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={isEditing ? handleUpdate : handleAdd}
                fullWidth
                style={{ marginTop: '20px' }}
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
              {isEditing && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetForm}
                  fullWidth
                  style={{ marginTop: '10px' }}
                >
                  Cancel Edit
                </Button>
              )}
            </CardContent>

          </Card>

        </Grid>
        <Grid item xs={12} md={8}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Avatar src={product.imageUrl} alt={product.name} />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{categories.find(category => category.id === product.category_id)?.name}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleEdit(product)}>Edit</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ManagerProduct;
