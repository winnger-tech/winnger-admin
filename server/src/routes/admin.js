const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getDrivers,
  getRestaurants,
  updateDriverPayment,
  updateRestaurantPayment,
  login,
  getDashboardStats
} = require('../controllers/admin');

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Driver routes
router.get('/drivers', getDrivers);
router.put('/drivers/:id/payment', updateDriverPayment);

// Restaurant routes
router.get('/restaurants', getRestaurants);
router.put('/restaurants/:id/payment', updateRestaurantPayment);

module.exports = router; 