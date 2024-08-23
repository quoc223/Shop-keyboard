const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Import routes
const productRoutes = require('../routes/productRoutes');
const userRoutes = require('../routes/userRoutes');
const orderRoutes = require('../routes/orderRoutes'); 
const categoryRoutes = require('../routes/categoryRoutes');
const authRoutes = require('../routes/authRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');
const blogRoutes = require('../routes/blogRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
      'style-src': ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
      'img-src': ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
      'connect-src': ["'self'", process.env.BACKEND_URL || 'http://localhost:3001'],
      'worker-src': ["'self'", 'blob:'],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
  })
);

// Routes

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', blogRoutes);
app.use('/api', reviewRoutes);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});