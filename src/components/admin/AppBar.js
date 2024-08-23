import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  Box,
  MenuItem,
  Tooltip,
  IconButton,
  Avatar,
} from '@mui/material';
// Create a custom theme


function AppBar1() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const settings = ['Profile', 'Account'];
  const navigate = useNavigate();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    fetch("http://localhost:3001/api/logout", {
        method: "POST",
        credentials: "include", // Gửi kèm cookie khi gọi API
    })
        .then((response) => {
            if (response.ok) {
                // Xử lý khi logout thành công
                console.log("Logged out successfully");
                navigate("/login"); // Điều hướng đến trang login sau khi logout
            } else {
                return response.json().then((err) => Promise.reject(err));
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred during logout");
        });
};
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      <Box>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="User Avatar" src="/static/images/avatar.jpg" />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography variant="body1" component={Link} to={`/dashboard/index`}>Dashboard</Typography>
          </MenuItem>
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography variant="body1" component={Link} to={`/`}>{setting}</Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
            <Typography variant="body1"  sx={{ color: 'text.primary', textDecoration: 'none' }}>
              Logout
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography variant="body1" component={Link} to={`/login`}>Login</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  </AppBar>
  );
}

export default AppBar1;