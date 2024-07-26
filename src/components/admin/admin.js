import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const API_URL = 'http://localhost:3001/api/product/';

function Admin() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setProduct({ id: null, name: '', description: '', price: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const handleAdd = () => {
    axios.post(API_URL, product).then((response) => {
      setProducts([...products, response.data]);
      handleClose();
    });
  };

  const handleEdit = (id) => {
    const editProduct = products.find((product) => product.id === id);
    setProduct(editProduct);
    setOpen(true);
  };

  const handleUpdate = () => {
    axios.put(`${API_URL}/${product.id}`, product).then((response) => {
      const updatedProducts = products.map((p) =>
        p.id === product.id ? response.data : p
      );
      setProducts(updatedProducts);
      handleClose();
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
    });
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Product Management</Typography>
          <Button variant="contained" color="success" component={Link} to={ '/orderlist'}>
        Manage Order
        </Button>

        <Button variant="contained" color="secondary">
        Manage Orders
        </Button>


        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ marginTop: '1rem' }}>
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(product.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(product.id)}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              style={{ marginTop: '1rem' }}
            >
              Add Product
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{product.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={product.id ? handleUpdate : handleAdd}
            color="primary"
          >
            {product.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Admin;