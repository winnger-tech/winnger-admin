const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const driverController = require('../controllers/driverController');

// Setup AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer with S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Define upload fields
const uploadFields = upload.fields([
  { name: 'driversLicenseFront', maxCount: 1 },
  { name: 'driversLicenseBack', maxCount: 1 },
  { name: 'vehicleRegistration', maxCount: 1 },
  { name: 'vehicleInsurance', maxCount: 1 },
  { name: 'drivingAbstract', maxCount: 1 },
  { name: 'workEligibility', maxCount: 1 },
  { name: 'sinCard', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]);

const router = express.Router();

router.post(
  '/register',
  uploadFields,
  driverController.register
);

router.post(
  '/payment/confirm',
  driverController.confirmPayment
);

router.post(
  '/background-check/webhook',
  driverController.handleBackgroundCheckWebhook
);

module.exports = router;
