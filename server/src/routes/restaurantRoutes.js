const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const restaurantController = require('../controllers/RestaurantController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  registerRestaurant,
  getProfile,
  updateProfile,
  updateRestaurantStatus,
  sendVerificationCode,
  verifyOTP,
  updateMenuItems,
  updateHours,
  updateTaxInfo
} = restaurantController;

// Validation middleware
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
  body('menuDetails').isArray().withMessage('Menu details must be an array'),
  body('hoursOfOperation').isArray().withMessage('Hours of operation must be an array')
];

// Email verification routes
router.post('/verify-email', sendVerificationCode);
router.post('/verify-otp', verifyOTP);

// Register new restaurant
router.post(
  '/',
  upload.fields([
    { name: 'businessDocuments', maxCount: 5 },
    { name: 'voidCheque', maxCount: 1 },
    { name: 'menuImages', maxCount: 10 }
  ]),
  validateRestaurantRegistration,
  registerRestaurant
);

// Protected routes
router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/:id/status', updateRestaurantStatus);

router.put('/:restaurantId/menu',
  upload.array('menuImages', 50),
  body('menuDetails').isArray().withMessage('Menu details must be an array'),
  updateMenuItems
);

router.put('/:restaurantId/hours',
  body('hoursOfOperation').isArray().withMessage('Hours of operation must be an array'),
  updateHours
);

router.put('/:restaurantId/tax-info',
  body('taxInfo').isObject().withMessage('Tax information is required'),
  updateTaxInfo
);

module.exports = router; 