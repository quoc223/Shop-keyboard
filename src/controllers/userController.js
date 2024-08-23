const pool = require('../config/database');
const bcrypt = require('bcryptjs');
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

exports.getUserPurchaseChange = async (req, res) => {
  try {
    const [results] = await pool.query('CALL GetUserPurchaseChange()');
    if (results && results[0] && results[0][0]) {
      res.json(results[0][0]);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
exports.updateProfileBycus = async (req, res) => {
  const id = req.user.id;
  const { name, email, password } = req.body;

  try {
    // Tạo đối tượng chứa các trường cần cập nhật
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // Tạo các phần câu lệnh SET động dựa trên các trường cần cập nhật
    const fields = Object.keys(updateFields).map((field) => `${field} = ?`).join(', ');
    const values = Object.values(updateFields);

    if (fields.length > 0) {
      await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ message: 'No fields to update' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
exports.changepassword = async (req, res) => {
  const { id } = req.user.id;
  const { password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};
exports.changeaddress = async (req, res) => { 
  const { id } = req.user.id;
  const { address_line1, address_line2, city, country } = req.body;
  try {
    await pool.query('UPDATE shipping_addresses SET address_line1 = ?,  address_line2 =?  ,city =?,country =? WHERE id = ?', [address_line1,address_line2,city,country, id]);
    res.json({ message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
}
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}
exports.addUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng mới vào cơ sở dữ liệu
    await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    );

    res.json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
};
exports.updateProfileByid = async (req, res) => {
  const id = req.params.id; // Accessing the id directly from params
  const { name, email, password, phone, role, is_active } = req.body;

  try {
    // Create an object with the fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (phone) updateFields.phone = phone;
    if (role) updateFields.role = role;
    if (is_active !== undefined) updateFields.is_active = is_active; // Check if is_active is defined

    // Create the SET clause based on the fields to update
    const fields = Object.keys(updateFields).map((field) => `${field} = ?`).join(', ');
    const values = Object.values(updateFields);

    if (fields.length > 0) {
      await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ message: 'No fields to update' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
