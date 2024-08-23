import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const drawerWidth = 240;

function Sidebar() {
  const [integrationsOpen, setIntegrationsOpen] = React.useState(false);

  const handleIntegrationsClick = () => {
    setIntegrationsOpen(!integrationsOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e2d',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ bgcolor: '#2d2d3f', p: 1, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2">Workspace</Typography>
          <Typography variant="body1">Devias</Typography>
        </Box>
      </Box>
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard"
          sx={{
            backgroundColor: '#6366f1',
            '&:hover': {
              backgroundColor: '#6366f1',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/user">
          <ListItemIcon sx={{ color: 'white' }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
        <ListItem button onClick={handleIntegrationsClick}>
          <ListItemIcon sx={{ color: 'white' }}>
            <IntegrationInstructionsIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
          {integrationsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={integrationsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          
            <ListItem button component={Link} to="/dashboard/product">
            <ListItemIcon><Inventory2Icon /></ListItemIcon>
            <ListItemText primary="Manager Product" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/order">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Manager Order" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/blog">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Manager Blogs" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/review">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Manager Review" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon sx={{ color: 'white' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/account">
          <ListItemIcon sx={{ color: 'white' }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button component={Link} to="/error">
          <ListItemIcon sx={{ color: 'white' }}>
            <ErrorIcon />
          </ListItemIcon>
          <ListItemText primary="Error" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;