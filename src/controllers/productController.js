const pool = require('../config/database');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM products');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  const searchTerm = req.query.term;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const searchValue = `%${searchTerm}%`;
  try {
    const [results] = await pool.query('SELECT * FROM products WHERE name LIKE ?', [searchValue]);
    res.json(results);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (categoryId === 'all') {
      const [results] = await pool.query('SELECT * FROM products');
      res.json(results);
    } else {
      const [results] = await pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
      res.json(results);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProductsById = async (req, res) => {
  const { productId } = req.params;

  // Các giá trị cần cập nhật được lấy từ req.body
  const { name, description, price, category_id, stock, imageUrl, brand } = req.body;

  try {
    // Cập nhật sản phẩm theo productId
    const [results] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ?, imageUrl = ?, brand=? WHERE id = ?',
      [name, description, price, category_id, stock, imageUrl,brand, productId]
    );

    if (results.affectedRows === 0) {
      // Nếu không có sản phẩm nào được cập nhật, trả về lỗi 404
      res.status(404).json({ message: 'Product not found' });
    } else {
      // Nếu cập nhật thành công, trả về thông báo thành công
      res.json({ message: 'Product updated successfully' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình cập nhật, trả về lỗi 500
    res.status(500).json({ message: error.message });
  }
};
exports.deleteProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    // Thực hiện câu truy vấn DELETE để xóa sản phẩm dựa trên productId
    const [results] = await pool.query('DELETE FROM products WHERE id = ?', [productId]);

    if (results.affectedRows === 0) {
      // Nếu không có sản phẩm nào bị xóa, trả về lỗi 404
      res.status(404).json({ message: 'Product not found' });
    } else {
      // Nếu xóa thành công, trả về thông báo thành công
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về lỗi 500
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, brand, imageUrl, category_id, stock } = req.body;
  const query = `
    INSERT INTO products 
    (name, description, price, brand, imageUrl, category_id, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, description, price, brand, imageUrl, category_id, stock];
 
  try {
    const [results] = await pool.query(query, values);
    res.status(201).json({ 
      id: results.insertId, 
      name, 
      description, 
      price, 
      brand, 
      imageUrl, 
      category_id, 
      stock
     
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.uploadImage = async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const formData = new FormData();
  formData.append('key', process.env.API_KEY_IMAGE);
  formData.append('action', 'upload');
  formData.append('source', fs.createReadStream(req.file.path), req.file.filename);
  formData.append('format', 'json');

  try {
    const response = await axios.post(process.env.IMAGE_UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Delete the temporary file after upload
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: response.data.image.url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};