const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  login,
  getDashboardStats,
  getAllDrivers,
  getAllRestaurants,
  updateDriverStatus,
  updateRestaurantStatus,
  exportData
} = require('../controllers/adminController');

// Public routes
router.post('/login', login);

// Protected routes - only accessible by authenticated admins
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Driver routes
router.get('/drivers', getAllDrivers);
router.put('/drivers/:id/status', updateDriverStatus);

// Restaurant routes
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/status', updateRestaurantStatus);

// Export routes
router.get('/export', exportData);

module.exports = router; 