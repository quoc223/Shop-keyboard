import { Box, Slider, FormControl, Card, CardMedia, Button ,Typography} from '@mui/material';
import { styled } from '@mui/material';
import ReactPaginate from "react-paginate";

//listpoduct.js
export const StyledBox = styled(Box)(({ theme }) => ({
    width: '35%',
    padding: theme.spacing(3),
    backgroundColor: '#f9f9f9',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));
export const StyledPaginate = styled(ReactPaginate)({
    display: "flex",
    justifyContent: "center",
    listStyle: "none",
    padding: 0,
    margin: "20px 0",
    "& li": {
        margin: "0 5px",
    },
    "& a": {
        padding: "5px 10px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#f0f0f0",
        },
    },
    "& .selected a": {
        backgroundColor: "#1976d2",
        color: "white",
    },
});
export const StyledSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary.main,
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:hover, &.Mui-focusVisible, &.Mui-active': {
            boxShadow: 'inherit',
        },
    },
    '& .MuiSlider-rail': {
        opacity: 0.8,
        backgroundColor: '#d8d8d8',
    },
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '100%',
    '& .MuiSelect-select': {
        padding: '10px',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#fff',
        border: '1px solid #d8d8d8',
        '&:focus': {
            backgroundColor: '#fff',
        },
    },
}));
export const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[4],
    },
}));

export const StyledCardMedia = styled(CardMedia)({
    paddingTop: "55%", // 16:9 aspect ratio
    backgroundSize: "contain",
    backgroundPosition: "center",
});
export const StyledButton = styled(Button)(({ theme }) => ({
    flex: 1,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[2],
    },
}));
//category.js
export const CategoryCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[4],
    },
  }));
  
  export  const CategoryImage = styled(CardMedia)({
    paddingTop: '75%', // 4:3 aspect ratio
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  });
  
 export const CategoryName = styled(Typography)({
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '16px',
  });