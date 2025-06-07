const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  registerRestaurant,
  getProfile,
  updateProfile,
  updateRestaurantStatus,
  updatePaymentStatus
} = require('../controllers/restaurantController');

// Register new restaurant
router.post('/', upload.fields([
  { name: 'fssai', maxCount: 1 },
  { name: 'gst', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 }
]), registerRestaurant);

// Get restaurant profile
router.get('/profile', protect, getProfile);

// Update restaurant profile
router.put('/profile', protect, updateProfile);

// Update restaurant status (admin only)
router.put('/:id/status', protect, updateRestaurantStatus);

// Update payment status
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
