const pool = require('../config/database');

// Get user by email
const getUserByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT u.*, r.name as role FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Get user by ID
const getUserById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT u.*, r.name as role FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Create new user
const createUser = async (name, email, hashedPassword, roleId = 2, address = null, hotelName = null) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role_id, address, hotel_name) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, roleId, address, hotelName]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Get all users (admin only)
const getAllUsers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT u.id, u.name, u.email, u.registered_at, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       ORDER BY u.registered_at DESC`
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Delete user (admin only)
const deleteUser = async (userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM votes WHERE user_id = ?', [userId]);
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);
  } finally {
    connection.release();
  }
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getAllUsers,
  deleteUser
};
