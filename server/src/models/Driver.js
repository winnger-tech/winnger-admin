const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Driver extends Model {
    static associate(models) {
      Driver.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Driver.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    vehicleType: {
      type: DataTypes.ENUM('Walk', 'Scooter', 'Bike', 'Car', 'Van', 'Other'),
      allowNull: false
    },
    vehicleMake: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicleModel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    yearOfManufacture: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        async isValidYear(value) {
          const currentYear = new Date().getFullYear();
          const user = await sequelize.models.User.findByPk(this.userId);
          
          if (this.vehicleType !== 'Walk' && this.vehicleType !== 'Bike' && this.vehicleType !== 'Scooter') {
            if (currentYear - value < 25) {
              throw new Error('Vehicle must be at least 25 years old for meal delivery');
            }
          }
        }
      }
    },
    vehicleColor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicleLicensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Z0-9]+$/i
      }
    },
    driversLicenseClass: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        async isValidClass(value) {
          const user = await sequelize.models.User.findByPk(this.userId);
          if (user.province === 'Ontario') {
            if (!['G', 'G2'].includes(value)) {
              throw new Error('Ontario drivers must have Class G or G2 license');
            }
          } else {
            if (value !== '5') {
              throw new Error('Drivers must have Class 5 license');
            }
          }
        }
      }
    },
    driversLicenseFrontUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    driversLicenseBackUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicleRegistrationUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicleInsuranceUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    drivingAbstractUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    drivingAbstractDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isWithinThreeMonths(value) {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          if (new Date(value) < threeMonthsAgo) {
            throw new Error('Driving abstract must be from the last 3 months');
          }
        }
      }
    },
    criminalBackgroundCheckUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    criminalBackgroundCheckDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isWithinSixMonths(value) {
          if (value) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            if (new Date(value) < sixMonthsAgo) {
              throw new Error('Criminal background check must be from the last 6 months');
            }
          }
        }
      }
    },
    workEligibilityUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    workEligibilityType: {
      type: DataTypes.ENUM('passport', 'pr_card', 'work_permit', 'study_permit'),
      allowNull: false
    },
    sinNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\d{9}$/
      }
    },
    sinCardUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    backgroundCheckStatus: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    certnApplicantId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certnCheckId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'razorpay', 'paypal'),
      allowNull: false
    },
    paymentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 65.00,
      validate: {
        equals(value) {
          if (parseFloat(value) !== 65.00) {
            throw new Error('Payment amount must be CAD $65.00');
          }
        }
      }
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankingInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        hasRequiredFields(value) {
          const required = ['transitNumber', 'institutionNumber', 'accountNumber'];
          for (const field of required) {
            if (!value[field]) {
              throw new Error(`Banking info missing ${field}`);
            }
          }
          if (!/^\d{3}$/.test(value.transitNumber)) {
            throw new Error('Transit number must be 3 digits');
          }
          if (!/^\d{5}$/.test(value.institutionNumber)) {
            throw new Error('Institution number must be 5 digits');
          }
          if (!/^\d{7,12}$/.test(value.accountNumber)) {
            throw new Error('Account number must be 7-12 digits');
          }
        }
      }
    },
    consentAndDeclarations: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        hasRequiredConsent(value) {
          const required = [
            'termsAndConditions',
            'backgroundScreening',
            'privacyPolicy',
            'electronicCommunication'
          ];
          for (const field of required) {
            if (!value[field]) {
              throw new Error(`Consent missing for ${field}`);
            }
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Driver'
  });

  return Driver;
};
