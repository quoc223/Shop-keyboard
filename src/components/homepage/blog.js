import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  CardContent, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalShipping, Headset, VerifiedUser } from '@mui/icons-material';
import axios from 'axios';

// Tạo styled components
const StyledCard = styled('div')(({ theme }) => ({
  height: 300,
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardMedia = styled('img')({
  height: 140,
  width: '100%',
  objectFit: 'cover',
  flexShrink: 0,
});
const StyledIcon = styled('IconButton')({
  height: 140,
  width: '100%',
  
});
const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const TruncatedTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const features = [
    {
      icon: <LocalShipping />,
      title: "MIỄN PHÍ VẬN CHUYỂN",
      description: "Tất cả sản phẩm được đặt hàng tại Akko.vn đều được miễn phí vận chuyển. Khách hàng được kiểm tra hàng trước khi thanh toán."
    },
    {
      icon: <Headset />,
      title: "HỖ TRỢ 24/7",
      description: "Hỗ trợ khách hàng trực tuyến về mua hàng cũng như các thắc mắc về sản phẩm."
    },
    {
      icon: <VerifiedUser />,
      title: "CHẾ ĐỘ BẢO HÀNH VƯỢT TRỘI",
      description: "Tất cả sản phẩm Akko đều được bảo hành 12 tháng. 1 đổi 1. Trung tâm bảo hành toàn quốc"
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Feature section */}
      <Box my={4}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard>
                <StyledCardContent>
                  <StyledIcon color="primary" size="large">
                    {feature.icon}
                  </StyledIcon>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <TruncatedTypography variant="body2" color="text.secondary">
                    {feature.description}
                  </TruncatedTypography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Blog section */}
      <Box my={4}>
        <Typography variant="h4" gutterBottom align="center">
          TIN MỚI NHẤT
        </Typography>
        <Grid container spacing={4}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StyledCard>
                <StyledCardMedia
                  src={blog.urlImage}
                  alt={blog.title}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {blog.title}
                  </Typography>
                  <TruncatedTypography variant="body2" color="text.secondary">
                    {blog.description}
                  </TruncatedTypography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Blog;