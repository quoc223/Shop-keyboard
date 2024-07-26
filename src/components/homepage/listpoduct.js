import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./style.scss";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid } from '@mui/material';
function ListProduct() {
    const [data, setData] = useState([]);   
    const typographyVariants = {
        h6: {xs: "0.8rem",sm: "1rem", md: "1.2rem"} ,
        body2: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem" },
        hg: {xs: "0.3rem",sm: "0.5rem", md: "0.7rem"} 
      };
    
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
        <div className="boxproduct">
            <Container>
                <Grid container spacing={2} className="listproduct">
                {data.map((item) => (
                    <Grid item xs={3} key={item._id}>
                        <Card sx={{ maxWidth: 300 }} className="card">
                            <CardMedia component="img" alt={item.name} loading="lazy" height="40%" image={item.imageUrl}/>
                            <div className="grcontent">
                                <CardContent >
                                <Typography gutterBottom variant="h6" component="div"  c>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize:  typographyVariants.body2 }}>
                                    {item.description}
                                </Typography>
                                <Typography variant="h7" color="primary" sx={{ fontSize: typographyVariants.h6}} >
                                    Price:   {item.price} USD
                                 </Typography>
                                </CardContent>
                            </div>
                            <div className="grbtn">
                                <CardActions  >
                                    <Button size="small" variant="contained" component={Link} to={`/order/${item._id}`} sx={{ fontSize: typographyVariants.hg }} >Add Card</Button>
                                    <Button size="small" variant="contained" component={Link} to={`/product/${item._id}`}  sx={{ fontSize: typographyVariants.hg }}>View Detail</Button>
                                </CardActions>
                            </div>
                        </Card>
                    </Grid>
                ))}
                </Grid>
        </Container>
</div>
    );
}

export default ListProduct;
