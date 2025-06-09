const BaseController = require('./BaseController');
const { Driver, sequelize } = require('../models');
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
        deliveryType,
        yearOfManufacture,
        vehicleColor,
        vehicleLicensePlate,
        driversLicenseClass,
        drivingAbstractDate,
        workEligibilityType,
        sinNumber,
        bankingInfo,
        consentAndDeclarations
      } = req.body;

      const parsedBankingInfo = JSON.parse(bankingInfo);
      const parsedConsentAndDeclarations = JSON.parse(consentAndDeclarations);

      // Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 6500,
        currency: 'cad',
        payment_method_types: ['card'],
        metadata: {
          registration_type: 'driver',
          email: email
        }
      });

      const result = await sequelize.transaction(async (t) => {
        const documentUrls = await this.uploadDriverDocuments(req.files);

        const driver = await Driver.create({
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
          deliveryType,
          yearOfManufacture,
          vehicleColor,
          vehicleLicensePlate,
          driversLicenseClass,
          drivingAbstractDate,
          workEligibilityType,
          sinNumber,
          bankingInfo: parsedBankingInfo,
          consentAndDeclarations: parsedConsentAndDeclarations,
          stripePaymentIntentId: paymentIntent.id,
          ...documentUrls
        }, { transaction: t });

        return { driver, paymentIntent };
      });

      return res.status(201).json({
        success: true,
        data: {
          driverId: result.driver.id,
          clientSecret: result.paymentIntent.client_secret
        },
        message: 'Driver registration initiated successfully'
      });

    } catch (error) {
      console.error('Driver registration error:', error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Failed to register driver'
      });
    }
  }

  async uploadDriverDocuments(files) {
    const documentUrls = {};
    const requiredDocuments = [
      'profilePhoto',
      'driversLicenseFront',
      'driversLicenseBack',
      'vehicleRegistration',
      'vehicleInsurance',
      'drivingAbstract',
      'workEligibility'
    ];

    for (const docType of requiredDocuments) {
      if (files[docType] && files[docType][0]) {
        documentUrls[`${docType}Url`] = files[docType][0].location;
      } else {
        throw new Error(`Missing required document: ${docType}`);
      }
    }

    if (files.sinCard && files.sinCard[0]) {
      documentUrls.sinCardUrl = files.sinCard[0].location;
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

        await driver.update({ paymentStatus: 'completed' });

        const applicant = await certnApi.createApplicant({
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          phoneNumber: driver.cellNumber,
          dateOfBirth: driver.dateOfBirth,
          address: {
            streetAddress: driver.streetNameNumber,
            unit: driver.appUniteNumber,
            city: driver.city,
            province: driver.province,
            postalCode: driver.postalCode,
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
            criminalBackgroundCheckUrl: data.results?.criminalCheck?.reportUrl,
            drivingAbstractUrl: data.results?.drivingAbstract?.reportUrl
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
