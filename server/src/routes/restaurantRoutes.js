// server/src/routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const restaurantController = require('../controllers/RestaurantController');
const { protect } = require('../middleware/auth');

// ‼️ STEP 1: Import the specific middleware, not the entire module
const { restaurantUpload } = require('../middleware/upload');

const {
  registerRestaurant,
  getProfile,
  updateProfile,
  updateRestaurantStatus,
  sendVerificationCode,
  verifyOTP,
  updateMenuItems,
  updateHours,
  updateTaxInfo,
  createPaymentIntent
} = restaurantController;

// Validation middleware (no changes needed here)
const validateRestaurantRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('dateOfBirth').isDate().withMessage('Please provide a valid date'),
  body('cellNumber').matches(/^\+1-\d{3}-\d{3}-\d{4}$/).withMessage('Please provide a valid phone number format: +1-XXX-XXX-XXXX'),
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('businessPhone').matches(/^\+1-\d{3}-\d{3}-\d{4}$/).withMessage('Please provide a valid phone number format: +1-XXX-XXX-XXXX'),
  body('businessEmail').isEmail().withMessage('Please provide a valid business email'),
  body('bankingInfo').isObject().withMessage('Banking information is required'),
  body('taxInfo').isObject().withMessage('Tax information is required'),
  body('menuDetails').isString().withMessage('Menu details must be a JSON string'),
  body('hoursOfOperation').isString().withMessage('Hours of operation must be a JSON string')
];

// Email verification routes
router.post('/verify-email', sendVerificationCode);
router.post('/verify-otp', verifyOTP);

// Payment route
router.post('/create-payment-intent', createPaymentIntent);

// Register new restaurant
// ‼️ STEP 2: Use the 'restaurantUpload' variable directly.
// The .fields() configuration is now handled inside middleware/upload.js
router.post(
  '/',
  restaurantUpload,
  validateRestaurantRegistration,
  registerRestaurant
);

// Protected routes (no changes needed here)
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/menu', updateMenuItems);
router.put('/hours', updateHours);
router.put('/tax-info', updateTaxInfo);

// Admin routes (no changes needed here)
router.put('/:id/status', updateRestaurantStatus);

module.exports = router;