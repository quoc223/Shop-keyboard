import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./style.scss";
import { styled } from '@mui/material/styles';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions ,Box} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[4],
    },
  }));
  
  const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9 aspect ratio
    objectFit: 'cover',
  });
  
  const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
  });
  
  const StyledCardActions = styled(CardActions)({
    padding: '16px',
    justifyContent: 'space-between',
  });
  
  const StyledButton = styled(Button)(({ theme }) => ({
    width: '48%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(1),
    },
  }));
  const ButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 16px 16px',
  });
  
  const ActionButton = styled(Button)({
    flex: 1,
    padding: '6px 12px',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
  });
function ListProduct() {
    const [data, setData] = useState([]);   
   
    
    useEffect(() => {
        axios.get('http://localhost:3001/api/product')
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []); 
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {data.map((item) => (
          <Card key={item._id} sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image={item.imageUrl}
              alt={item.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
            <Typography variant="h6" color="primary" sx={{ px: 2, pb: 1 }}>
              ${item.price}
            </Typography>
            <ButtonContainer>
              <ActionButton
                variant="contained"
                color="primary"
                component={Link}
                to={`/order/${item._id}`}
              >
                Add to cart
              </ActionButton>
              <Box sx={{ width: 8 }} /> {/* Khoảng cách giữa các nút */}
              <ActionButton
                variant="outlined"
                component={Link}
                to={`/product/${item._id}`}
              >
                View details
              </ActionButton>
            </ButtonContainer>
          </Card>
        ))}
      </Box>
    );
}

export default ListProduct;
