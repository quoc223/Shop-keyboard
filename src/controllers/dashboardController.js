const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
        if (user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3600000 });
        return res.json({ message: 'Admin logged in successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSalesData = async (req, res) => {
  try {
    const [results] = await pool.query('CALL GetMonthlyIncome()');
    if (results && results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
exports.protected= async (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  };