import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    
    Search as SearchIcon,
  } from '@mui/icons-material';
import {
   
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
    Stack,
    TablePagination
} from "@mui/material";

const API_URL = "http://localhost:3001/api/order/";
const API_URL_UPDATESTATUS = "http://localhost:3001/api/order/updatestatus/:id";
const API_URL_DELETE = "http://localhost:3001/api/order/delete/:id";
const API_URL_UPDATE = "http://localhost:3001/api/order/update/:id";
const API_URL_ALL = "http://localhost:3001/api/allorder";
const API_URL_INFOR = "http://localhost:3001/api/order/Alldata/:orderId";
//const API_URL_Detail ="http://localhost:3001/api/order/ProductInOrder/:orderId";

function ManagerOrder() {
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [itemOffset, setItemOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState({
        order_id: null,
        total: "",
        created_at: "",
        name: "",
        phone: "",
        status: "pending",
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get(API_URL_ALL).then((response) => {
            setOrders(response.data);
        });
    };

    const handleViewDetails = (orderId) => {
        axios
            .get(API_URL_INFOR.replace(":orderId", orderId))
            .then((response) => {
                console.log("API response:", response.data); // Để debug
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

    const handleOpen = () => {
        setOpen(true);
        setOrder({
            id: null,
            customerName: "",
            productName: "",
            quantity: "",
            status: "pending",
        });
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
        const editOrder = orders.find((order) => order.order_id === id);
        setOrder(editOrder);
        setOpen(true);
    };

    const handleUpdate = () => {
        axios
            .put(`${API_URL_UPDATE.replace(":id", order.order_id)}`, order)
            .then((response) => {
                const updatedOrders = orders.map((o) =>
                    o.order_id === order.order_id ? response.data : o
                );
                setOrders(updatedOrders);
                handleClose();
            });
    };

    const handleDelete = (id) => {
        axios.delete(`${API_URL_DELETE.replace(":id", id)}`).then(() => {
            const updatedOrders = orders.filter(
                (order) => order.order_id !== id
            );
            setOrders(updatedOrders);
        });
    };

    const handleUpdateStatus = (id, status) => {
        axios
            .put(`${API_URL_UPDATESTATUS.replace(":id", id)}`, { status })
            .then(() => {
                fetchOrders();
            });
    };
   
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
      };
      const filteredUsers = orders.filter((order) => {
        const searchLower = search.toLowerCase();
        return (
          (order.name?.toLowerCase().includes(searchLower) || '') ||
          (order.phone?.toLowerCase().includes(searchLower) || '') 
          
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
            <Grid container spacing={3} style={{ marginTop: "1rem" }}>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>User Name</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Create At</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((order) => (
                                        <TableRow key={order.order_id}>
                                            <TableCell>
                                                {order.order_id}
                                            </TableCell>
                                            <TableCell>{order.name}</TableCell>
                                            <TableCell>{order.phone}</TableCell>
                                            <TableCell>{order.total}</TableCell>
                                            <TableCell>
                                                {order.created_at}
                                            </TableCell>
                                            <TableCell>
                                                {order.status}
                                            </TableCell>
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleEdit(
                                                                order.order_id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleDelete(
                                                                order.order_id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="info"
                                                        size="small"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                order.order_id
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredUsers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                
                                />
                            </Table>
                        </TableContainer>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen}
                            style={{ marginTop: "1rem" }}
                        >
                            Add Order
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {order.order_id ? "Edit Order" : "Update Order"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        name="customerName"
                        label="Customer Name"
                        value={order.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="phone"
                        label="phone"
                        value={order.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="total"
                        label="total"
                        value={order.total}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        name="created_at"
                        label="created_at"
                        value={order.created_at}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="text"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            value={order.status}
                            onChange={(e) =>
                                handleUpdateStatus(
                                    order.order_id,
                                    e.target.value
                                )
                            }
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={order.order_id ? handleUpdate : handleAdd}
                        color="primary"
                    >
                        {order.order_id ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
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
    );
}

export default ManagerOrder;
