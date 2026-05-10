import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const authAPI = {
  register: (name, email, password, confirmPassword, address, hotelName, isAdmin = false) =>
    api.post('/auth/register', { name, email, password, confirmPassword, address, hotelName, isAdmin }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

export const voteAPI = {
  getResults: () =>
    api.get('/votes/results'),
  getResultsByLocation: (location) =>
    api.get(`/votes/results/${location}`),
  checkVotedToday: () =>
    api.get('/votes/voted-today'),
  submitVote: (mealId) =>
    api.post('/votes/vote', { mealId }),
};

export const mealAPI = {
  // For admin - get meals by restaurant
  getByRestaurant: (restaurantId, date = null) => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    return api.get(`/meals/admin/meals?restaurantId=${restaurantId}&date=${queryDate}`);
  },
  
  // For users - get meals by location (college)
  getByLocation: (location, date = null) => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    return api.get(`/meals/location/${location}?date=${queryDate}`);
  },
  
  // Get single meal
  getById: (id) =>
    api.get(`/meals/${id}`),
  
  // Create meal with deadline
  create: (name, price, description, restaurantId, mealDate, deadline = null) =>
    api.post('/meals', { name, price, description, restaurantId, mealDate, deadline }),
  
  // Update meal with deadline
  update: (id, name, price, description, mealDate, deadline = null) =>
    api.put(`/meals/${id}`, { name, price, description, mealDate, deadline }),
  
  // Delete meal
  delete: (id) =>
    api.delete(`/meals/${id}`),
};

export const restaurantAPI = {
  getAll: (location = null) => {
    if (location) {
      return api.get(`/restaurants?location=${location}`);
    }
    return api.get('/restaurants');
  },
  getByLocation: (location) =>
    api.get(`/restaurants?location=${location}`),
  create: (name, location = null) =>
    api.post('/restaurants', { name, location }),
  update: (id, name, location = null) =>
    api.put(`/restaurants/${id}`, { name, location }),
  delete: (id) =>
    api.delete(`/restaurants/${id}`),
};

export const adminAPI = {
  getAllUsers: () =>
    api.get('/admin/users'),
  deleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`),
};

export default api;
