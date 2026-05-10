const pool = require('../config/database');

// Get meal voting results for today
const getMealVotesForToday = async () => {
  const connection = await pool.getConnection();
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await connection.query(
      `SELECT m.id, m.name, m.price, m.restaurant_id, r.name as restaurant_name, r.location,
              COUNT(v.id) as vote_count
       FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       LEFT JOIN votes v ON m.id = v.meal_id AND v.vote_date = ?
       WHERE m.meal_date = ?
       GROUP BY m.id
       ORDER BY vote_count DESC`,
      [today, today]
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Check if user already voted today
const hasUserVotedToday = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id FROM votes WHERE user_id = ? AND vote_date = CURDATE()',
      [userId]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
};

// Get user's vote for today (which meal they voted for)
const getUserVoteForToday = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT v.id, v.meal_id, m.name as meal_name, m.price, r.name as restaurant_name
       FROM votes v
       JOIN meals m ON v.meal_id = m.id
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE v.user_id = ? AND v.vote_date = CURDATE()`,
      [userId]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Create or update vote (user can change their vote)
const createOrUpdateVote = async (userId, mealId) => {
  const connection = await pool.getConnection();
  try {
    // Delete previous vote if exists
    await connection.query(
      'DELETE FROM votes WHERE user_id = ? AND vote_date = CURDATE()',
      [userId]
    );

    // Create new vote
    const [result] = await connection.query(
      'INSERT INTO votes (user_id, meal_id, vote_date) VALUES (?, ?, CURDATE())',
      [userId, mealId]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Get votes for a specific meal
const getVotesForMeal = async (mealId, voteDate) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT COUNT(*) as vote_count FROM votes WHERE meal_id = ? AND vote_date = ?`,
      [mealId, voteDate]
    );
    return rows[0].vote_count;
  } finally {
    connection.release();
  }
};

// Get votes for all meals in a location on a date
const getVotesForLocationMeals = async (location, voteDate) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT m.id, m.name, COUNT(v.id) as vote_count
       FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       LEFT JOIN votes v ON m.id = v.meal_id AND v.vote_date = ?
       WHERE r.location = ? AND m.meal_date = ?
       GROUP BY m.id
       ORDER BY vote_count DESC`,
      [voteDate, location, voteDate]
    );
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  getMealVotesForToday,
  hasUserVotedToday,
  getUserVoteForToday,
  createOrUpdateVote,
  getVotesForMeal,
  getVotesForLocationMeals
};
