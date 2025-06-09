const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer config
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      cb(null, fileName);
    }
  })
});

// Upload fields
const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'driversLicenseFront', maxCount: 1 },
  { name: 'driversLicenseBack', maxCount: 1 },
  { name: 'vehicleRegistration', maxCount: 1 },
  { name: 'vehicleInsurance', maxCount: 1 },
  { name: 'drivingAbstract', maxCount: 1 },
  { name: 'workEligibility', maxCount: 1 },
  { name: 'sinCard', maxCount: 1 }
]);

// Routes
router.post('/register', uploadFields, driverController.register);
router.post('/confirm-payment', driverController.confirmPayment);
router.post('/background-check-webhook', driverController.handleBackgroundCheckWebhook);

module.exports = router;
