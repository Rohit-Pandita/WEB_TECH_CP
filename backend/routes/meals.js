const express = require('express');
const MealModel = require('../models/Meal');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get meals for admin's restaurant with vote counts
router.get('/admin/meals', isAdmin, async (req, res) => {
  try {
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
    const { location } = req.params;
    const mealDate = req.query.date || new Date().toISOString().split('T')[0];
    
    const meals = await MealModel.getMealsByLocationAndDate(location, mealDate);
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
    const { name, price, description, restaurantId, mealDate, deadline } = req.body;

    if (!name || !price || !restaurantId || !mealDate) {
      return res.status(400).json({ error: 'Name, price, restaurant, and date required' });
    }

    const mealId = await MealModel.createMeal(
      name, 
      price, 
      description || '', 
      restaurantId, 
      mealDate,
      deadline || null
    );
    
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

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
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
    await MealModel.deleteMeal(id);
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

module.exports = router;
