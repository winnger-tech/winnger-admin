const BaseController = require('./BaseController');
const { User, Driver, sequelize } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { certnApi } = require('../utils/certnApi');

class DriverController extends BaseController {
  constructor() {
    super();
    this.stripe = stripe;
    this.register = this.register.bind(this);
    this.confirmPayment = this.confirmPayment.bind(this);
    this.handleBackgroundCheckWebhook = this.handleBackgroundCheckWebhook.bind(this);
  }

  async register(req, res) {
    try {
      this.validateRequest(req);

      const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        cellNumber,
        streetNameNumber,
        appUniteNumber,
        city,
        province,
        postalCode,
        vehicleType,
        vehicleMake,
        vehicleModel,
        yearOfManufacture,
        vehicleColor,
        vehicleLicensePlate,
        sinNumber,
        bankingInfo,
        consentAndDeclarations
      } = req.body;

      // Create payment intent for background check fee
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 6500, // $65.00 in cents
        currency: 'cad',
        payment_method_types: ['card'],
        metadata: {
          registration_type: 'driver',
          email: email
        }
      });

      // Start transaction
      const result = await sequelize.transaction(async (t) => {
        // Create user
        const user = await User.create({
          email,
          password,
          userType: 'driver',
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          cellNumber,
          streetNameNumber,
          appUniteNumber,
          city,
          province,
          postalCode
        }, { transaction: t });

        // Upload documents
        const documentUrls = await this.uploadDriverDocuments(req.files);

        // Create driver
        const driver = await Driver.create({
          userId: user.id,
          vehicleType,
          vehicleMake,
          vehicleModel,
          yearOfManufacture,
          vehicleColor,
          vehicleLicensePlate,
          sinNumber,
          bankingInfo,
          consentAndDeclarations,
          stripePaymentIntentId: paymentIntent.id,
          ...documentUrls
        }, { transaction: t });

        return { user, driver, paymentIntent };
      });

      return this.handleSuccess(res, {
        userId: result.user.id,
        driverId: result.driver.id,
        clientSecret: result.paymentIntent.client_secret
      }, 'Driver registration initiated');

    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async uploadDriverDocuments(files) {
    const documentUrls = {};
    const requiredDocuments = [
      'driversLicenseFront',
      'driversLicenseBack',
      'vehicleRegistration',
      'vehicleInsurance',
      'drivingAbstract',
      'workEligibility'
    ];

    for (const docType of requiredDocuments) {
      if (files[docType]) {
        const url = await this.uploadFile(files[docType][0]);
        documentUrls[`${docType}Url`] = url;
      }
    }

    // Optional documents
    if (files.sinCard) {
      documentUrls.sinCardUrl = await this.uploadFile(files.sinCard[0]);
    }

    return documentUrls;
  }

  async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;
      
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const driver = await Driver.findOne({
          where: { stripePaymentIntentId: paymentIntentId }
        });

        if (!driver) {
          throw { status: 404, message: 'Driver not found' };
        }

        // Update payment status
        await driver.update({ paymentStatus: 'completed' });

        // Initiate background check
        const user = await User.findByPk(driver.userId);
        const applicant = await certnApi.createApplicant({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.cellNumber,
          dateOfBirth: user.dateOfBirth,
          address: {
            streetAddress: user.streetNameNumber,
            unit: user.appUniteNumber,
            city: user.city,
            province: user.province,
            postalCode: user.postalCode,
            country: 'CA'
          }
        });

        const check = await certnApi.requestBackgroundCheck(applicant.id);

        await driver.update({
          certnApplicantId: applicant.id,
          certnCheckId: check.id,
          backgroundCheckStatus: 'in_progress'
        });

        return this.handleSuccess(res, {
          message: 'Payment confirmed and background check initiated'
        });
      }

      throw { status: 400, message: 'Payment not succeeded' };

    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async handleBackgroundCheckWebhook(req, res) {
    try {
      const { type, data } = req.body;

      const driver = await Driver.findOne({
        where: { certnCheckId: data.checkId }
      });

      if (!driver) {
        throw { status: 404, message: 'Driver not found' };
      }

      switch (type) {
        case 'check.completed':
          await driver.update({
            backgroundCheckStatus: 'completed',
            criminalBackgroundCheckUrl: data.results.criminalCheck.reportUrl,
            drivingAbstractUrl: data.results.drivingAbstract.reportUrl
          });
          break;

        case 'check.failed':
          await driver.update({
            backgroundCheckStatus: 'failed'
          });
          break;

        default:
          console.log(`Unhandled webhook type: ${type}`);
      }

      return this.handleSuccess(res, { message: 'Webhook processed' });

    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new DriverController();
