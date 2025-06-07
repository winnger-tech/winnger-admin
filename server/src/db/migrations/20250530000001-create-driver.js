'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Drivers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.JSONB,
        defaultValue: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      documents: {
        type: Sequelize.JSONB,
        defaultValue: {
          aadharCard: {
            url: '',
            key: '',
            verified: false
          },
          drivingLicense: {
            url: '',
            key: '',
            verified: false
          }
        }
      },
      payment: {
        type: Sequelize.JSONB,
        defaultValue: {
          status: 'pending',
          transactionId: '',
          amount: null,
          date: null
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      verificationStatus: {
        type: Sequelize.JSONB,
        defaultValue: {
          email: false,
          phone: false
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Drivers');
  }
};
