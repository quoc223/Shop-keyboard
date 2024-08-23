

import item1 from "../../assets/main-item/akko-5075b-plus-s-dracula-castle-280x280.png"
import item2 from "../../assets/main-item/akko-keycap-set-neon-07-280x280.png"
import item3 from "../../assets/main-item/Akko-Hamster-X-wireless-Hima-01-280x280.png"
import item4 from "../../assets/main-item/akko-cs-pom-switch-silver-ava-280x280.png"
import item5 from "../../assets/main-item/day-cap-custom-AKKO-macaw-ava-280x280.png"
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import { Grid, Card,Box, CardMedia, CardContent, Typography } from '@mui/material';
import { CategoryCard,CategoryName, CategoryImage } from './StyledComponents';

function SaleProduct(){
    var images = [
        {
            id:1,
            name:"Keyboard",
            srcimg: item1,          
        },
        {
            id:2,
            name:"Keycaps",
            srcimg: item2
        },
        {
            id:3,
            name:"Mouse",
            srcimg:item3
        },
        {
            id:4,
            name:"Switch",
            srcimg:item4
        },
        {
            id:5,
            name:"Accessories",
            srcimg:item5
        }
    ]
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/category')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load categories');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Box textAlign="center" py={4}>Loading...</Box>;
  if (error) return <Box textAlign="center" py={4} color="error.main">{error}</Box>;

  return (
    <Box p={4} bgcolor="#f5f5f5">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={4}>
        Danh Sách Loại Sản Phẩm
      </Typography>
      <Grid container spacing={4}>
        {images.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
            <CategoryCard component={Link} to={`/products/category/${item.id}`} sx={{ textDecoration: 'none' }}>
              <CategoryImage
                image={item.srcimg}
                title={item.name}
              />
              <CardContent>
                <CategoryName variant="h6" component="h2">
                  {item.name}
                </CategoryName>
              </CardContent>
            </CategoryCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SaleProduct;