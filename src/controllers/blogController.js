const pool = require('../config/database');

// Lấy tất cả các blog
exports.getAllBlogs = async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM blog');
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Lấy một blog theo ID
  exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
      const [results] = await pool.query('SELECT * FROM blog WHERE id = ?', [id]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json(results[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Tạo một blog mới
  exports.createBlog = async (req, res) => {
    const { user_id, title, rating, description, urlImage } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO blog (user_id, title, rating, description, urlImage) VALUES (?, ?, ?, ?, ?)',
        [user_id, title, rating, description, urlImage]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Cập nhật một blog theo ID
  exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, rating, description, urlImage } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE blog SET title = ?, rating = ?, description = ?, urlImage = ? WHERE id = ?',
        [title, rating, description, urlImage, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json({ message: 'Blog updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Xóa một blog theo ID
  exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM blog WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };