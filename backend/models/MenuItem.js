const pool = require('../config/database');

// Get menu items by meal
const getMenuItemsByMeal = async (mealId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT mi.id, mi.meal_id, mi.meal_type_id, mt.name as meal_type_name
       FROM menu_items mi
       JOIN meal_types mt ON mi.meal_type_id = mt.id
       WHERE mi.meal_id = ?`,
      [mealId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Create menu item
const createMenuItem = async (mealId, mealTypeId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO menu_items (meal_id, meal_type_id) VALUES (?, ?)',
      [mealId, mealTypeId]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Delete menu item
const deleteMenuItem = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM menu_items WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
};

module.exports = {
  getMenuItemsByMeal,
  createMenuItem,
  deleteMenuItem
};
