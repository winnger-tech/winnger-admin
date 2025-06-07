const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const AdminModel = require('./Admin');
const DriverModel = require('./Driver');
const RestaurantModel = require('./Restaurant');
const UserModel = require('./User');

// Initialize models
const models = {
  Admin: AdminModel(sequelize),
  Driver: DriverModel(sequelize),
  Restaurant: RestaurantModel(sequelize),
  User: UserModel(sequelize)
};

// Add model associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
