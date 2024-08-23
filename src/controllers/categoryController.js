const pool = require('../config/database');

exports.getAllCategories = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM categories');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};