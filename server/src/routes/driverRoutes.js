const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const driverController = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware
const validateDriverRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('dateOfBirth').isDate().withMessage('Please provide a valid date'),
  body('cellNumber').matches(/^\+1-\d{3}-\d{3}-\d{4}$/).withMessage('Please provide a valid phone number format: +1-XXX-XXX-XXXX'),
  body('vehicleType').isIn(['Walk', 'Scooter', 'Bike', 'Car', 'Van', 'Other']).withMessage('Please provide a valid vehicle type'),
  body('yearOfManufacture').isInt({ min: 1900 }).withMessage('Please provide a valid year'),
  body('sinNumber').notEmpty().withMessage('SIN number is required'),
  body('bankingInfo').isObject().withMessage('Banking information is required'),
  body('consentAndDeclarations').isObject().withMessage('Consent and declarations are required')
];

// Routes
router.post('/register',
  upload.fields([
    { name: 'driversLicenseFront', maxCount: 1 },
    { name: 'driversLicenseBack', maxCount: 1 },
    { name: 'vehicleRegistration', maxCount: 1 },
    { name: 'vehicleInsurance', maxCount: 1 },
    { name: 'drivingAbstract', maxCount: 1 },
    { name: 'workEligibility', maxCount: 1 },
    { name: 'sinCard', maxCount: 1 }
  ]),
  validateDriverRegistration,
  driverController.register
);

router.post('/payment/confirm',
  protect,
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  driverController.confirmPayment
);

router.post('/background-check/webhook',
  driverController.handleBackgroundCheckWebhook
);

module.exports = router; 