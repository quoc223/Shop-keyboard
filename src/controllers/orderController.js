const pool = require('../config/database');

exports.getAllOrders = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM orders');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getOrderByUserId = async (req, res) => {
  const userId = req.user.id;
  try {
    const [results] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.json(results);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};
exports.orderUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
exports.updateOrderDetails = async (req, res) => {
  const { id } = req.params;
  const { status, items } = req.body; // `items` là mảng chứa các sản phẩm cần cập nhật

  try {
    // Cập nhật trạng thái đơn hàng
    const [orderResult] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    if (orderResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cập nhật thông tin các sản phẩm trong đơn hàng
    for (const item of items) {
      const { item_id, product_id, quantity } = item;

      const [itemResult] = await pool.query(
        'UPDATE order_items SET product_id = ?, quantity = ? WHERE id = ? AND order_id = ?',
        [product_id, quantity, item_id, id]
      );

      if (itemResult.affectedRows === 0) {
        return res.status(404).json({ message: `Order item with id ${item_id} not found in order ${id}` });
      }
    }

    res.json({ message: 'Order details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order details', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedAddresses = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(`
      SELECT id, address_line1, address_line2, city, country
      FROM shipping_addresses
      WHERE user_id = ?
    `, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching saved addresses:', error);
    res.status(500).json({ message: 'Error fetching saved addresses', error });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.imageUrl
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    await pool.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `, [userId, productId, quantity, quantity]);
    
    const [productInfo] = await pool.query(`
      SELECT p.id AS product_id, p.name, p.price, p.imageUrl, ci.quantity
      FROM products p
      JOIN cart_items ci ON p.id = ci.product_id
      WHERE ci.user_id = ? AND p.id = ?
    `, [userId, productId]);

    res.status(201).json({ 
      message: 'Product added to cart', 
      item: productInfo[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing cart item', error: error.message });
  }
};

exports.syncCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItems } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    for (const item of cartItems) {
      await connection.query(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
      `, [userId, item.product_id, item.quantity]);
    }

    await connection.commit();
    res.json({ message: 'Cart synced successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error syncing cart', error });
  } finally {
    connection.release();
  }
};

exports.checkout = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddressId, cartItems } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await connection.query(`
      INSERT INTO orders (user_id, shipping_address_id, total, status)
      VALUES (?, ?, ?, 'pending')
    `, [userId, shippingAddressId, total]);

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.price]);
    }

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error creating order', error });
  } finally {
    connection.release();
  }
};

exports.getcartcount = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ count: result[0].count || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart count', error: error.message });
  }
};
exports.vpay = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [results] = await pool.query('CALL GetOrderDetail(?)', [orderId]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMostPopularProduct = async (req, res) => {
  try {
    const [results] = await pool.query('CALL GetMostPopularProduct()');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllOrder = async (req, res) => {
  try {
    // Thực thi thủ tục lưu trữ
    const [results] = await pool.query('CALL GetAllOrdersInfo()');
    
    // In kết quả ra log để kiểm tra cấu trúc
   

    // Kiểm tra dữ liệu trả về từ thủ tục lưu trữ
    if (results && results[0]) {
      res.json(results[0]); // results[0] chứa dữ liệu trả về từ thủ tục lưu trữ
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



exports.getDetailOrderById = async (req, res) => {
  let { orderId } = req.body;

  // Kiểm tra nếu orderId là undefined, gán null hoặc trả về lỗi
  if (orderId === undefined) {
    return res.status(400).json({ message: 'orderId is required' });
  }

  try {
    const [orderDetails] = await pool.execute('CALL GetDetailOrderById(?)', [orderId]);
    const result = JSON.parse(JSON.stringify(orderDetails));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

exports.getAllDataForOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [resultSets] = await pool.query('CALL GetAllDataForOrderById(?)', [orderId]);
    

    if (resultSets && resultSets.length > 0) {
      const orderInfo = resultSets[0].reduce((acc, current) => {
        if (!acc) {
          return current;
        }
        // Gộp các trường tổng quan (nếu có) từ các hàng khác nhau
        acc.order_id = current.order_id;
        acc.total = current.total;
        acc.created_at = current.created_at;
        acc.updated_at = current.updated_at;
        acc.status = current.status;
        acc.full_address = current.full_address;
        acc.user_name = current.user_name;
        acc.email = current.email;
        acc.phone = current.phone;
        acc.is_default = current.is_default;
        return acc;
      }, null);

      const orderItems = resultSets[0].map((item) => ({
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price,
        rating: item.rating,
        comment: item.comment,
      }));

      res.json({ orderInfo, orderItems });
    } else {
      res.json({ orderInfo: {}, orderItems: [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order data', error: error.message });
  }
};

