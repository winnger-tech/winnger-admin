'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Drivers', 'vehicleType', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'car' // providing a default value for existing records
    });

    await queryInterface.addColumn('Drivers', 'licenseNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PENDING' // providing a default value for existing records
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Drivers', 'vehicleType');
    await queryInterface.removeColumn('Drivers', 'licenseNumber');
  }
}; 