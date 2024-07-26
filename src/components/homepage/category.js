import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <List>
      {categories.map((category) => (
        <ListItem key={category._id} button component={Link} to={`/product/${category._id}`}>
          <ListItemText primary={category.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryList;