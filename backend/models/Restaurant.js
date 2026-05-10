const pool = require('../config/database');

// Get all restaurants
const getAllRestaurants = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id, name, location FROM restaurants ORDER BY name'
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get restaurants by location
const getRestaurantsByLocation = async (location) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id, name, location FROM restaurants WHERE location LIKE ? ORDER BY name',
      [`%${location}%`]
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get restaurant by ID
const getRestaurantById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id, name, location FROM restaurants WHERE id = ?',
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Create restaurant (admin only)
const createRestaurant = async (name, location = null) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO restaurants (name, location) VALUES (?, ?)',
      [name, location]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update restaurant (admin only)
const updateRestaurant = async (id, name, location = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE restaurants SET name = ?, location = ? WHERE id = ?',
      [name, location, id]
    );
  } finally {
    connection.release();
  }
};

// Delete restaurant (admin only)
const deleteRestaurant = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM votes WHERE restaurant_id = ?', [id]);
    await connection.query('DELETE FROM menu_items WHERE meal_id IN (SELECT id FROM meals WHERE restaurant_id = ?)', [id]);
    await connection.query('DELETE FROM meals WHERE restaurant_id = ?', [id]);
    await connection.query('DELETE FROM restaurants WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantsByLocation,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
