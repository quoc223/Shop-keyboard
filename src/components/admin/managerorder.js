import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const API_URL = 'http://localhost:3001/api/order/';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState({
    id: null,
    customerName: '',
    productName: '',
    quantity: '',
    status: '',
  });

  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setOrders(response.data);
    });
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setOrder({ id: null, customerName: '', productName: '', quantity: '', status: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setOrder({ ...order, [event.target.name]: event.target.value });
  };

  const handleAdd = () => {
    axios.post(API_URL, order).then((response) => {
      setOrders([...orders, response.data]);
      handleClose();
    });
  };

  const handleEdit = (id) => {
    const editOrder = orders.find((order) => order.id === id);
    setOrder(editOrder);
    setOpen(true);
  };

  const handleUpdate = () => {
    axios.put(`${API_URL}/${order.id}`, order).then((response) => {
      const updatedOrders = orders.map((o) =>
        o.id === order.id ? response.data : o
      );
      setOrders(updatedOrders);
      handleClose();
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      const updatedOrders = orders.filter((order) => order.id !== id);
      setOrders(updatedOrders);
    });
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Order Management</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ marginTop: '1rem' }}>
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(order.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(order.id)}
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
              Add Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{order.id ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <DialogContent>
          <TextField
            name="customerName"
            label="Customer Name"
            value={order.customerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="productName"
            label="Product Name"
            value={order.productName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="quantity"
            label="Quantity"
            value={order.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={order.status}
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={order.id ? handleUpdate : handleAdd} color="primary">
            {order.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OrderList;