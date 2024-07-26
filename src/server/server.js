const express = require("express");
const mysql = require('mysql2');
const cors = require('cors'); // Import cors
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const saltRounds = 10;


const helmet = require('helmet'); 

const app = express();
const port = 3001;
// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin of your front-end application
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(helmet());
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", 'http://localhost:3000'],
      'style-src': ["'self'", 'http://localhost:3000'],
      'img-src': ["'self'", 'http://localhost:3000'],
      'connect-src': ["'self'", 'http://localhost:3001'], // Allow API calls
      'worker-src': ["'self'", 'blob:'], // Allow web workers
      'object-src': ["'none'"], // Disallow object embedding
      'frame-ancestors': ["'none'"], // Disallow framing
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
  })
);
// Create a connection to the database
  const connection =  mysql.createConnection({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
  });


// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});
//--------------- Define API product
//---------------getallproducts
// Get all products
app.get("/api/product", (req, res) => {
  connection.query('SELECT * FROM products', (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Get product by ID
app.get('/api/product/productId=:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM products WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(results[0]);
  });
});

// Get products by category
app.get('/api/products/category/categoryId=:categoryId', (req, res) => {
  const { categoryId } = req.params;
  connection.query('SELECT * FROM products WHERE category_id = ?', [categoryId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Create new product
app.post('/api/newproduct', async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  const query = 'INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, description, price, category, stock, imageUrl];
  
  try {
    const results = await connection.query(query, values);
    res.status(201).json({ id: results.insertId, name, description, price, category, stock, imageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search products
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  
  try {
    const results = await connection.query('SELECT * FROM products WHERE name LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
});

// Get all users
app.get("/api/user", async (req, res) => {
  try {
    const results = await connection.query('SELECT * FROM users');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  });
});
// Get all orders
app.get("/api/order", (req, res) => {
  connection.query('SELECT * FROM orders', (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Create new order
app.post('/api/neworder', (req, res) => {
  const { userId, productId, quantity, totalPrice, status } = req.body;
  if (!userId || !productId || !quantity || !totalPrice || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, userResults) => {
    if (error || userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    connection.query('SELECT * FROM products WHERE id = ?', [productId], (error, productResults) => {
      if (error || productResults.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const product = productResults[0];
      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      const orderQuery = 'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)';
      const orderValues = [userId, productId, quantity, totalPrice, status];
      connection.query(orderQuery, orderValues, (error, orderResults) => {
        if (error) {
          return res.status(500).json({ error: 'Internal server error' });
        }
        const updateStockQuery = 'UPDATE products SET stock = stock - ? WHERE id = ?';
        connection.query(updateStockQuery, [quantity, productId], (error) => {
          if (error) {
            return res.status(500).json({ error: 'Internal server error' });
          }
          res.status(201).json({ id: orderResults.insertId, userId, productId, quantity, totalPrice, status });
        });
      });
    });
  });
});

// Get order by ID
app.get('/api/order/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM orders WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(results[0]);
  });
});
// Get all categories
app.get("/api/category", (req, res) => {
  connection.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Get category by ID
app.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM categories WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input here (ensure username and password are provided)

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database with the hashed password
    await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    // Respond with success message (avoid sending back sensitive information)
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle potential errors, such as username already exists
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// -------Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});