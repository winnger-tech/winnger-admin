'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Restaurants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ownerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      restaurantName: {
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
          zipCode: ''
        }
      },
      documents: {
        type: Sequelize.JSONB,
        defaultValue: {
          fssai: {
            url: '',
            key: ''
          },
          gst: {
            url: '',
            key: ''
          },
          pan: {
            url: '',
            key: ''
          },
          businessLicense: {
            url: '',
            key: ''
          }
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Restaurants');
  }
};
