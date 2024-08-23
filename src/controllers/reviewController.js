const pool = require('../config/database');
// Lấy tất cả reviews
exports.getAllReviews = async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM reviews');
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Lấy review theo ID
 
exports.getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(
      `SELECT reviews.*, users.name AS user_name 
       FROM reviews 
       JOIN users ON reviews.user_id = users.id 
       WHERE reviews.id = ?`, 
      [id]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
  // Tạo review mới
  exports.createReview = async (req, res) => {
    const { user_id, product_id, rating, comment } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, product_id, rating, comment]
      );
      res.status(201).json({ id: result.insertId, user_id, product_id, rating, comment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Cập nhật review
  exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ id, rating, comment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Xóa review
  exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Lấy reviews theo product ID
  exports.getReviewsByProductId = async (req, res) => {
    const { productId } = req.params;
    try {
      const [results] = await pool.query('SELECT * FROM reviews WHERE product_id = ?', [productId]);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Lấy reviews theo user ID
  exports.getReviewsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const [results] = await pool.query('SELECT * FROM reviews WHERE user_id = ?', [userId]);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };