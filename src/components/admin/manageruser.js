import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Box,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const API_GETALLUSERS = "http://localhost:3001/api/user";
const API_UPDATEPROFILE = "http://localhost:3001/api/user/update";
const API_DELETEUSER = "http://localhost:3001/api/user/delete";
const API_ADDUSER = "http://localhost:3001/api/user/add"; // API endpoint for adding users

const ManagerUser = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_GETALLUSERS);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
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

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user || { name: '', email: '', password: '', phone: '', role: 'customer', is_active: true });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser.id) {
        // Update existing user
        await axios.put(`${API_UPDATEPROFILE}/${selectedUser.id}`, selectedUser);
      } else {
        // Add new user
        await axios.post(API_ADDUSER, selectedUser);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_DELETEUSER}/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChangeUserField = (field, value) => {
    setSelectedUser(prev => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenDialog(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser?.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser?.id
              ? 'Edit the user details below.'
              : 'Enter the details of the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUser?.name || ''}
            onChange={(e) => handleChangeUserField('name', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={selectedUser?.email || ''}
            onChange={(e) => handleChangeUserField('email', e.target.value)}
          />
          {!selectedUser?.id && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={selectedUser?.password || ''}
              onChange={(e) => handleChangeUserField('password', e.target.value)}
            />
          )}
          <TextField
            margin="dense"
            label="Phone"
            type="tel"
            fullWidth
            variant="outlined"
            value={selectedUser?.phone || ''}
            onChange={(e) => handleChangeUserField('phone', e.target.value)}
          />
          <Select
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={selectedUser?.role || 'customer'}
            onChange={(e) => handleChangeUserField('role', e.target.value)}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <FormControlLabel
            control={
              <Switch
                checked={selectedUser?.is_active || false}
                onChange={(e) => handleChangeUserField('is_active', e.target.checked)}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            {selectedUser?.id ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagerUser;
