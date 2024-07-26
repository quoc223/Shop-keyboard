import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import  './homepage/style.scss';


const Footer = () => {
  return (
    <div className="footerWrapper">
        <footer className="footer">
        <Container maxWidth="lg">
            <Grid container spacing={4}>
            <Grid item xs={12} sm={4} className="footerSection">
                <Typography variant="h6" gutterBottom>
                About Us
                </Typography>
                <Typography variant="body2" color="textSecondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                ac elit at velit fringilla bibendum vel vel velit.
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4} className="footerSection">
                <Typography variant="h6" gutterBottom>
                Quick Links
                </Typography>
                <ul className="footerList">
                <li>
                    <Link href="#" className="footerLink" >
                    Home
                    </Link>
                </li>
                <li>
                    <Link href="#" className="footerLink">
                    About
                    </Link>
                </li>
                <li>
                    <Link href="#" className="footerLink">
                    Services
                    </Link>
                </li>
                <li>
                    <Link href="#" className="footerLink">
                    Contact
                    </Link>
                </li>
                </ul>
            </Grid>
            <Grid item xs={12} sm={4} className="footerSection">
                <Typography variant="h6" gutterBottom>
                Follow Us
                </Typography>
                <Box className="footerSocial">
                <Link href="#" className="footerSocialLink">
                    <i className="fab fa-facebook-f"></i>
                </Link>
                <Link href="#" className="footerSocialLink">
                    <i className="fab fa-twitter"></i>
                </Link>
                <Link href="#" className="footerSocialLink">
                    <i className="fab fa-instagram"></i>
                </Link>
                </Box>
            </Grid>
            </Grid>
            <Box textAlign="center" mt={4} className="footerSocialLink">
            <Typography variant="body2" color="textSecondary">
                &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
            </Typography>
            </Box>
        </Container>
        </footer>
    </div>
  );
};

export default Footer;