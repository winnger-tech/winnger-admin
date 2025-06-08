'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Admins table
    await queryInterface.createTable('Admins', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'super_admin'),
        defaultValue: 'admin'
      },
      lastLogin: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Drivers table
    await queryInterface.createTable('Drivers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cellNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      streetNameNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      appUniteNumber: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      province: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleMake: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleModel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      yearOfManufacture: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vehicleColor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleLicensePlate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driversLicenseClass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driversLicenseFrontUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driversLicenseBackUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleRegistrationUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleInsuranceUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      drivingAbstractUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      drivingAbstractDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      criminalBackgroundCheckUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      criminalBackgroundCheckDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      workEligibilityUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      workEligibilityType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sinNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sinCardUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bankingInfo: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      backgroundCheckStatus: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      certnApplicantId: {
        type: Sequelize.STRING
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      consentAndDeclarations: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Restaurants table
    await queryInterface.createTable('Restaurants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cellNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      streetNameNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      appUniteNumber: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      province: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      businessAddress: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      businessPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      businessEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      identificationType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      businessDocumentUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bankingInfo: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      voidChequeUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      taxInfo: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      menuDetails: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      hoursOfOperation: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Restaurants');
    await queryInterface.dropTable('Drivers');
    await queryInterface.dropTable('Admins');
  }
}; 