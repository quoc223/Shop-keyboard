import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrderChart = () => {
  const [products, setProducts] = useState([]);
  const API_URL = 'http://localhost:3001/api/orderItems';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      // Convert total_quantity_sold to number
      const productsData = response.data[0].map(product => ({
        ...product,
        total_quantity_sold: Number(product.total_quantity_sold)
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to generate a random color
  const generateColor = (index) => {
    const hue = (index * 137.508) % 360; // Use golden angle approximation
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Generate an array of colors based on the number of products
  const colors = Array.from({ length: products.length }, (_, index) => generateColor(index));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
        {products.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            
              <Tooltip />
              
              <Pie
                data={products}
                dataKey="total_quantity_sold"
                nameKey="name"
                outerRadius={140}
                fill="#8884d8"
              >
                {products.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" align="center" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default OrderChart;