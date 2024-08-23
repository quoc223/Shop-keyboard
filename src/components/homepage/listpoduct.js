import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Snackbar, InputLabel, Select, MenuItem } from "@mui/material";
import {
    StyledBox,
    StyledCard,
    StyledCardMedia,
    StyledButton,
    StyledFormControl,
    StyledPaginate,
    StyledSlider,
} from "./StyledComponents";
import {
    Container,
    Grid,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";

axios.defaults.withCredentials = true;

function ListProduct() {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
    const [sortOrder, setSortOrder] = useState(""); // Sorting: "asc" or "desc"
    const navigate = useNavigate();
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 9; // Adjust as needed
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "http://localhost:3001/api/product";
                if (categoryId) {
                    url = `http://localhost:3001/api/products/category/${categoryId}`;
                }
                const response = await axios.get(url);
                setProducts(response.data);
                setPageCount(Math.ceil(response.data.length / itemsPerPage));
            } catch (err) {
                setError("Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        const fetchCategoryName = async () => {
            try {
                if (categoryId) {
                    const response = await axios.get(
                        `http://localhost:3001/api/category/${categoryId}`
                    );
                    setCategoryName(response.data.name);
                }
            } catch (err) {
                setError("Error fetching category name");
            }
        };

        fetchProducts();
        fetchCategoryName();
    }, [categoryId]);

    const addCart = async (product) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/addtocart",
                {
                    productId: product.id,
                    quantity: 1,
                },
                {
                    withCredentials: true,
                }
            );

            setSnackbarMessage("Product added to cart");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            setSnackbarMessage("Error adding product to cart");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

   

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    const filteredProducts = products.filter(
        (product) =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
    };
    // Filter products by price range
   

    // Sort products by price
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.price - b.price;
        } else if (sortOrder === "desc") {
            return b.price - a.price;
        }
        return 0;
    });

    const currentItems = sortedProducts.slice(
        itemOffset,
        itemOffset + itemsPerPage
    );

    if (loading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                    fontWeight="bold"
                >
                    {categoryId ? `Category: ${categoryName}` : "All Products"}
                </Typography>

                {/* Price Range Filter */}
                <Box
                    mb={4}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* Price Range Filter */}
                    <StyledBox>
                        <Typography
                            variant="h6"
                            gutterBottom
                            color="textPrimary"
                            fontWeight="bold"
                            align="center"
                        >
                            Khoảng Giá
                        </Typography>
                        <StyledSlider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000} // Adjust according to your product price range
                        />
                    </StyledBox>

                    {/* Sorting */}
                    <StyledBox sx={{ width: "25%" }}>
                        <StyledFormControl fullWidth>
                            <InputLabel>Lọc Giá</InputLabel>
                            <Select
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <MenuItem value="">Không Lọc</MenuItem>
                                <MenuItem value="asc">Thấp Đến Cao</MenuItem>
                                <MenuItem value="desc">Cao Đến Thấp</MenuItem>
                            </Select>
                        </StyledFormControl>
                    </StyledBox>
                </Box>

                <Grid container spacing={4}>
                    {currentItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <StyledCard>
                                <StyledCardMedia
                                    image={item.imageUrl}
                                    title={item.name}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="h2"
                                        fontWeight="bold"
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                        sx={{ height: 60, overflow: "hidden" }}
                                    >
                                        {item.description}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="p"
                                        mt={2}
                                        fontWeight="bold"
                                        color="primary"
                                    >
                                        ${item.price}
                                    </Typography>
                                </CardContent>
                                <Box
                                    p={2}
                                    mt="auto"
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => addCart(item)}
                                    >
                                        Thêm Vào Giỏ
                                    </StyledButton>
                                    <StyledButton
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() =>
                                            navigate(`/product/${item.id}`)
                                        }
                                    >
                                        Xem Chi Tiết
                                    </StyledButton>
                                </Box>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
                <StyledPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< Previous"
                    renderOnZeroPageCount={null}
                />
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ListProduct;
