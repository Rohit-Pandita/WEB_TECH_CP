const express = require('express');
const RestaurantModel = require('../models/Restaurant');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (location) {
      const restaurants = await RestaurantModel.getRestaurantsByLocation(location);
      return res.json(restaurants);
    }
    
    const restaurants = await RestaurantModel.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Failed to get restaurants' });
  }
});

// Create restaurant (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Restaurant name required' });
    }

    const restaurantId = await RestaurantModel.createRestaurant(name, location);
    res.status(201).json({ 
      message: 'Restaurant created',
      id: restaurantId
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});

// Update restaurant (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Restaurant name required' });
    }

    await RestaurantModel.updateRestaurant(id, name, location);
    res.json({ message: 'Restaurant updated' });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

// Delete restaurant (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await RestaurantModel.deleteRestaurant(id);
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

module.exports = router;
