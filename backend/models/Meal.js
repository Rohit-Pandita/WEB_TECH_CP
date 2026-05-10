const pool = require('../config/database');

// Get meals for a specific restaurant and date
const getMealsByRestaurantAndDate = async (restaurantId, mealDate) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT m.id, m.name, m.price, m.description, m.restaurant_id, m.meal_date, m.deadline,
              COUNT(v.id) as vote_count
       FROM meals m
       LEFT JOIN votes v ON m.id = v.meal_id AND v.vote_date = ?
       WHERE m.restaurant_id = ? AND m.meal_date = ?
       GROUP BY m.id
       ORDER BY m.created_at DESC`,
      [mealDate, restaurantId, mealDate]
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get meals by location (restaurant location) and date with vote counts
const getMealsByLocationAndDate = async (location, mealDate) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT m.id, m.name, m.price, m.description, m.restaurant_id, m.meal_date, m.deadline,
              r.name as restaurant_name, r.location,
              COUNT(v.id) as vote_count
       FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       LEFT JOIN votes v ON m.id = v.meal_id AND v.vote_date = ?
       WHERE r.location = ? AND m.meal_date = ?
       GROUP BY m.id
       ORDER BY m.created_at DESC`,
      [mealDate, location, mealDate]
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get meal by ID
const getMealById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT m.*, r.name as restaurant_name, r.location
       FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Create meal with deadline
const createMeal = async (name, price, description, restaurantId, mealDate, deadline = null) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO meals (name, price, description, restaurant_id, meal_date, deadline) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, price, description, restaurantId, mealDate, deadline]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update meal including deadline
const updateMeal = async (id, name, price, description, mealDate, deadline = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE meals SET name = ?, price = ?, description = ?, meal_date = ?, deadline = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, price, description, mealDate, deadline, id]
    );
    return true;
  } finally {
    connection.release();
  }
};

// Delete meal (and its votes)
const deleteMeal = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM votes WHERE meal_id = ?', [id]);
    await connection.query('DELETE FROM meals WHERE id = ?', [id]);
    return true;
  } finally {
    connection.release();
  }
};

// Get today's meals for a location with vote counts
const getTodaysMealsByLocation = async (location) => {
  const connection = await pool.getConnection();
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await connection.query(
      `SELECT m.id, m.name, m.price, m.description, m.restaurant_id, m.meal_date, m.deadline,
              r.name as restaurant_name, r.location,
              COUNT(v.id) as vote_count
       FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       LEFT JOIN votes v ON m.id = v.meal_id AND v.vote_date = ?
       WHERE r.location = ? AND m.meal_date = ?
       GROUP BY m.id
       ORDER BY m.created_at DESC`,
      [today, location, today]
    );
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  getMealsByRestaurantAndDate,
  getMealsByLocationAndDate,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getTodaysMealsByLocation
};
