const express = require('express');
const MealModel = require('../models/Meal');
const UserModel = require('../models/User');
const RestaurantModel = require('../models/Restaurant');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

const getAdminContext = async (userId) => {
  const user = await UserModel.getUserById(userId);

  if (!user || !user.hotel_name) {
    const error = new Error('Hotel profile is missing for this admin');
    error.statusCode = 400;
    throw error;
  }

  const restaurant = await RestaurantModel.getOrCreateRestaurant(
    user.hotel_name,
    user.address || null
  );

  return { user, restaurant };
};

const adminOwnsMeal = (meal, user, adminRestaurant) => {
  if (!meal || !user?.hotel_name) return false;
  if (Number(meal.restaurant_id) === Number(adminRestaurant.id)) return true;
  const mealName = (meal.restaurant_name || '').trim().toLowerCase();
  const hotelName = (user.hotel_name || '').trim().toLowerCase();
  return mealName.length > 0 && mealName === hotelName;
};

// Get all active meals for the admin's hotel
router.get('/owner/menu', isAdmin, async (req, res) => {
  try {
    await MealModel.deleteExpiredMeals();
    const { user } = await getAdminContext(req.session.userId);
    console.log('Fetching all meals for hotel:', user.hotel_name);
    const meals = await MealModel.getMealsByRestaurantName(user.hotel_name);
    console.log('Found meals:', meals.length);
    res.json(meals);
  } catch (error) {
    console.error('Get owner menu error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to get menu meals' });
  }
});

// Get all meals for today (admin dashboard overview)
router.get('/today', isAdmin, async (req, res) => {
  try {
    await MealModel.deleteExpiredMeals();
    const mealDate = req.query.date || new Date().toISOString().split('T')[0];
    const { user } = await getAdminContext(req.session.userId);
    const meals = await MealModel.getMealsByRestaurantNameAndDate(user.hotel_name, mealDate);
    res.json(meals);
  } catch (error) {
    console.error('Get today meals error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to get today\'s meals' });
  }
});

// Get meals for admin's restaurant with vote counts
router.get('/admin/meals', isAdmin, async (req, res) => {
  try {
    await MealModel.deleteExpiredMeals();
    const mealDate = req.query.date || new Date().toISOString().split('T')[0];
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }

    const meals = await MealModel.getMealsByRestaurantAndDate(restaurantId, mealDate);
    res.json(meals);
  } catch (error) {
    console.error('Get admin meals error:', error);
    res.status(500).json({ error: 'Failed to get meals' });
  }
});

// Get meals by location for user voting (filtered by college location)
router.get('/location/:location', async (req, res) => {
  try {
    await MealModel.deleteExpiredMeals();
    const { location } = req.params;

    const meals = await MealModel.getMealsByLocation(location);
    res.json(meals);
  } catch (error) {
    console.error('Get location meals error:', error);
    res.status(500).json({ error: 'Failed to get meals for location' });
  }
});

// Get single meal
router.get('/:id', async (req, res) => {
  try {
    const meal = await MealModel.getMealById(req.params.id);
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ error: 'Failed to get meal' });
  }
});

// Create meal (admin only) - with deadline support
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, price, description, mealDate, deadline } = req.body;
    const { restaurant } = await getAdminContext(req.session.userId);

    if (!name || !price || !mealDate) {
      return res.status(400).json({ error: 'Name, price, and date required' });
    }

    console.log('Creating meal:', { name, price, restaurant: restaurant.id, mealDate });
    
    const mealId = await MealModel.createMeal(
      name, 
      price, 
      description || '', 
      restaurant.id, 
      mealDate,
      deadline || null
    );
    
    console.log('Meal created with ID:', mealId);
    res.status(201).json({ 
      message: 'Meal created',
      id: mealId
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Update meal (admin only) - with deadline support
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, mealDate, deadline } = req.body;
    const { user, restaurant } = await getAdminContext(req.session.userId);
    const existingMeal = await MealModel.getMealById(id);

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }

    if (!existingMeal || !adminOwnsMeal(existingMeal, user, restaurant)) {
      return res.status(403).json({ error: 'You can only update meals from your own menu' });
    }

    await MealModel.updateMeal(
      id, 
      name, 
      price, 
      description || '',
      mealDate,
      deadline || null
    );
    
    res.json({ message: 'Meal updated' });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete meal (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, restaurant } = await getAdminContext(req.session.userId);
    const existingMeal = await MealModel.getMealById(id);

    if (!existingMeal || !adminOwnsMeal(existingMeal, user, restaurant)) {
      return res.status(403).json({ error: 'You can only delete meals from your own menu' });
    }

    await MealModel.deleteMeal(id);
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

module.exports = router;
