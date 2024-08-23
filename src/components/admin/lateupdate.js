import React from 'react';
import { Paper, Grid, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip } from '@mui/material';

const products = [
  { name: 'Soja & Co. Eucalyptus', date: 'Updated Aug 12, 2024' },
  { name: 'Necessaire Body Lotion', date: 'Updated Aug 12, 2024' },
  { name: 'Ritual of Sakura', date: 'Updated Aug 12, 2024' },
  { name: 'Lancome Rouge', date: 'Updated Aug 12, 2024' },
  { name: 'Erbology Aloe Vera', date: 'Updated Aug 12, 2024' },
];

const orders = [
  { id: 'ORD-007', customer: 'Ekaterina Tankova', date: 'Aug 12, 2024', status: 'Pending' },
  { id: 'ORD-006', customer: 'Cao Yu', date: 'Aug 12, 2024', status: 'Delivered' },
  { id: 'ORD-004', customer: 'Alexa Richardson', date: 'Aug 12, 2024', status: 'Refunded' },
  { id: 'ORD-003', customer: 'Anje Keizer', date: 'Aug 12, 2024', status: 'Pending' },
  { id: 'ORD-002', customer: 'Clarke Gillebert', date: 'Aug 12, 2024', status: 'Delivered' },
  { id: 'ORD-001', customer: 'Adam Denisov', date: 'Aug 12, 2024', status: 'Delivered' },
];

function LatestUpdates() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6" padding={2}>Latest products</Typography>
          <List>
            {products.map((product, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>{product.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={product.name} secondary={product.date} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6" padding={2}>Latest orders</Typography>
          <List>
            {orders.map((order, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={order.customer}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {order.id}
                      </Typography>
                      {` — ${order.date}`}
                    </React.Fragment>
                  }
                />
                <Chip 
                  label={order.status} 
                  color={order.status === 'Delivered' ? 'success' : order.status === 'Pending' ? 'warning' : 'error'} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LatestUpdates;