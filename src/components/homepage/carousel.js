import React from "react";
import Carousel from 'react-material-ui-carousel';
import { Paper, Box } from '@mui/material';
import Banner1 from '../../assets/baner/5075B-Plus-goku-naruto-1400x510.jpg';
import Banner2 from '../../assets/baner/AKKO-3068B-banner-01-1400x510.jpg';
import Banner3 from '../../assets/baner/banner.jpg';
import Banner4 from '../../assets/baner/M1-Banner-1400x510.jpg';

const banners = [Banner1, Banner2, Banner3, Banner4];

function CarouselLayout() {
    return (
        <Box sx={{ maxWidth: '100%', margin: 'auto', overflow: 'hidden' }}>
            <Carousel
                animation="slide"
                indicators={true}
                navButtonsAlwaysVisible={true}
                cycleNavigation={true}
                navButtonsProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 0,
                        padding: '10px',
                    }
                }}
            >
                {banners.map((banner, index) => (
                    <CarouselItem key={index} banner={banner} />
                ))}
            </Carousel>
        </Box>
    );
}

function CarouselItem({ banner }) {
    return (
        <Paper 
            elevation={0}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                overflow: 'hidden',
            }}
        >
            <img 
                src={banner} 
                alt={`Banner ${banner}`}
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                }}
            />
        </Paper>
    );
}

export default CarouselLayout;