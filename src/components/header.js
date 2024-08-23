import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { styled, alpha } from "@mui/material/styles";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Autocomplete,
    TextField,
    InputAdornment,
    Divider,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    ShoppingCart as ShoppingCartIcon,
    Keyboard as KeyboardIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
const axios = require('axios').default;

const settings = ["Profile", "Account"];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "300px",
    },
    "& .MuiInputBase-root": {
        color: "inherit",
        "& fieldset": {
            borderColor: alpha(theme.palette.common.white, 0.5),
        },
        "&:hover fieldset": {
            borderColor: theme.palette.common.black,
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.common.white,
        },
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.common.white,
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
}));

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);
    const [userName, setUserName] = useState("");
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchSearchResults(searchTerm);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    useEffect(() => {
        const fetchCartItemCount = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/cart/count",
                    { withCredentials: true }
                );
                setCartItemCount(response.data.count);
            } catch (error) {
                console.error("Error fetching cart item count:", error);
            }
        };

        const fetchUserName = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/profile",
                    { withCredentials: true }
                );
                setUserName(response.data.name);
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        fetchCartItemCount();
        fetchUserName();
    }, []);
    const fetchSearchResults = async (term) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/products/search?term=${term}`
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleSearch = (event, value) => {
        if (value) {
            navigate(`http://localhost:3001/api/product/${value.id}`); // Redirect to the product page {not complted}
        }
    };
    useEffect(() => {
        axios
            .get("http://localhost:3001/api/category")
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    const handleLogout = () => {
        fetch("http://localhost:3001/api/logout", {
            method: "POST",
            credentials: "include", // Gửi kèm cookie khi gọi API
        })
            .then((response) => {
                if (response.ok) {
                    // Xử lý khi logout thành công
                    console.log("Logged out successfully");
                    navigate("/login"); // Điều hướng đến trang login sau khi logout
                } else {
                    return response.json().then((err) => Promise.reject(err));
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred during logout");
            });
    };

    return (
        <StyledAppBar position="static">
            <Container>
                <Toolbar disableGutters>
                    {/* Logo and Title */}
                    <KeyboardIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Keyboard
                    </Typography>

                    {/* Mobile menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <StyledIconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                        >
                            <MenuIcon />
                        </StyledIconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            {data.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Button
                                        variant="body1"
                                        component={Link}
                                        to={`/products/category/${item.id}`}
                                        sx={{
                                            my: 2,
                                            color: "black",
                                            display: "block",
                                        }}
                                    >
                                        {item.name}
                                    </Button>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo and Title for small screens */}
                    <KeyboardIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Keyboard
                    </Typography>

                    {/* Navigation Buttons for large screens */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                        }}
                    >
                        {data.map((item) => (
                            <Button
                                key={item.id}
                                component={Link}
                                to={`/products/category/${item.id}`}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Search Autocomplete */}
                    <StyledAutocomplete
                        id="search-autocomplete"
                        options={searchResults}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search products..."
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option, { index }) => (
                            <>
                                <li {...props}>{option.name}</li>
                                {index < searchResults.length - 1 && (
                                    <Divider />
                                )}{" "}
                                {/* Line between options */}
                            </>
                        )}
                        onInputChange={(event, newInputValue) => {
                            setSearchTerm(newInputValue);
                        }}
                        onChange={handleSearch}
                        freeSolo
                    />

                    {/* Cart Icon */}
                    <StyledIconButton
                        component={Link}
                        to="/cart"
                        sx={{ ml: 2 }}
                    >
                        <Badge badgeContent={cartItemCount} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </StyledIconButton>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0, ml: 2 }}>
                        <Tooltip title="Open settings">
                            <StyledIconButton onClick={handleOpenUserMenu}>
                                <Avatar alt="User Avatar">
                                    {userName
                                        ? userName.charAt(0).toUpperCase()
                                        : ""}
                                </Avatar>
                            </StyledIconButton>
                        </Tooltip>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography
                                    variant="body1"
                                    component={Link}
                                    to={`/login-dashboard`}
                                    sx={{
                                        color: "text.primary",
                                        textDecoration: "none",
                                    }}
                                >
                                    Dashboard
                                </Typography>
                            </MenuItem>
                            
                            <MenuItem >
                                <Typography
                                component={Link}
                                to={`/profile`}
                                    variant="body1"
                                    sx={{
                                        color: "text.primary",
                                        textDecoration: "none",
                                    }}
                                >
                                    Profile
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "text.primary",
                                        textDecoration: "none",
                                    }}
                                >
                                    Logout
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography
                                    variant="body1"
                                    component={Link}
                                    to={`/login`}
                                    sx={{
                                        color: "text.primary",
                                        textDecoration: "none",
                                    }}
                                >
                                    Login
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
}

export default ResponsiveAppBar;
