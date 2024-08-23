import React from "react";
import {
    Container,
    Grid,
    Typography,
    Box,
    Link,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import {
    Facebook,
    Instagram,
    Twitter,
    MailOutline,
    Pinterest,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
    faCcVisa,
    faPaypal,
    faCcMastercard,
} from "@fortawesome/free-brands-svg-icons";

const StyledFooter = styled(Box)(({ theme }) => ({
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "50px 0 20px",
}));

const SocialIcon = styled(Link)(({ theme }) => ({
    color: "#ecf0f1",
    marginRight: theme.spacing(2),
    "&:hover": {
        color: theme.palette.primary.main,
    },
}));

const Tag = styled(Box)(({ theme }) => ({
    padding: "5px 10px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "5px",
    margin: "0 5px 5px 0",
    display: "inline-block",
}));

function Footer() {
    const [date] = useState(new Date().getFullYear());
    return (
        <StyledFooter>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            AKKO GEAR VIỆT NAM
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            AKKO.VN cung cấp các sản phẩm phân phối chính hãng
                            tại Việt Nam Showroom Hà Nội: 296 Trương Định, Tương
                            Mai, Hoàng Mai, Hà Nội
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", marginBottom: 2 }}
                        >
                            Hotline: 0934.389.001
                        </Typography>
                        <Box>
                            <SocialIcon href="#">
                                <Facebook />
                            </SocialIcon>
                            <SocialIcon href="#">
                                <Instagram />
                            </SocialIcon>
                            <SocialIcon href="#">
                                <Twitter />
                            </SocialIcon>
                            <SocialIcon href="#">
                                <MailOutline />
                            </SocialIcon>
                            <SocialIcon href="#">
                                <Pinterest />
                            </SocialIcon>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            THÔNG TIN MỚI
                        </Typography>
                        <Typography variant="body2" paragraph>
                            10 Th2 - Hướng dẫn sử dụng bàn phím cơ AKKO 3098B và
                            3098N
                        </Typography>
                        <Typography variant="body2" paragraph>
                            29 Th5 - Tìm hiểu về Akko switch CS, Akko switch CS
                            là gì?
                        </Typography>
                        <Typography variant="body2" paragraph>
                            23 Th9 - Tổng hợp driver bàn phím và chuột Akko
                        </Typography>
                        <Typography variant="body2" paragraph>
                            04 Th4 - Mở hộp chuột Akko X Hamster Wireless chính
                            hãng
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            TAGS
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {[
                                "3068B",
                                "3084",
                                "3087S",
                                "3098s",
                                "AKKO",
                                "Tokyo",
                                "RGB",
                                "SpongeBob",
                            ].map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            NHẬN EMAIL TỪ AKKO
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Your email"
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                marginBottom: 2,
                            }}
                        />
                        <Button variant="contained" fullWidth>
                            Subscribe
                        </Button>
                    </Grid>
                </Grid>

                <Divider
                    sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ marginBottom: { xs: 2, md: 0 } }}
                    >
                        Copyright {date} © QuocDev
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {[
                            { name: "visa", path: faCcVisa },
                            { name: "paypal", path: faPaypal },
                            { name: "mastercard", path: faCcMastercard },
                        ].map((payment) => (
                            <Box key={payment.name}>
                                <FontAwesomeIcon
                                    icon={payment.path}
                                    size="2x"
                                    style={{ boxShadow: "0 0 5px white" }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </StyledFooter>
    );
}

export default Footer;
