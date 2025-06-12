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
  body('ownerName').notEmpty().withMessage('Owner name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('identificationType').isIn(['licence', 'pr_card', 'passport', 'medical_card', 'provincial_id'])
    .withMessage('Invalid identification type'),
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('businessAddress').notEmpty().withMessage('Business address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('province').isIn(['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'])
    .withMessage('Invalid province'),
  body('postalCode').matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
    .withMessage('Invalid postal code format'),
  body('bankingInfo').isString().withMessage('Banking info must be a JSON string'),
  body('taxInfo').isString().withMessage('Tax info must be a JSON string'),
  body('menuDetails').isString().withMessage('Menu details must be a JSON string'),
  body('hoursOfOperation').isString().withMessage('Hours of operation must be a JSON string'),
  body('stripePaymentIntentId').notEmpty().withMessage('Stripe Payment Intent ID is required')
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