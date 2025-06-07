const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Restaurant.init({
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
    identificationType: {
      type: DataTypes.ENUM('licence', 'pr_card', 'passport', 'medical_card', 'provincial_id'),
      allowNull: false
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    businessDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\+1-\d{3}-\d{3}-\d{4}$/
      }
    },
    businessEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    bankingInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
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
    voidChequeUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taxInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        hasValidTaxNumbers(value) {
          const province = this.getDataValue('province');
          const taxRates = {
            GST: 5,
            HST: {
              ON: 13,
              default: 15
            },
            QST: 9.97,
            PST: {
              SK: 6,
              default: 7
            }
          };

          // GST Validation
          if (['AB', 'BC', 'MB', 'QC', 'SK', 'NT', 'YT', 'NU'].includes(province)) {
            if (!value.gstNumber) throw new Error('GST number required');
            if (!value.gstRate) value.gstRate = taxRates.GST;
          }

          // HST Validation
          if (['NB', 'NL', 'NS', 'ON', 'PE'].includes(province)) {
            if (!value.hstNumber) throw new Error('HST number required');
            value.hstRate = province === 'ON' ? taxRates.HST.ON : taxRates.HST.default;
          }

          // QST Validation
          if (province === 'QC') {
            if (!value.qstNumber) throw new Error('QST number required');
            value.qstRate = taxRates.QST;
          }

          // PST Validation
          if (['BC', 'MB', 'SK'].includes(province)) {
            if (!value.pstNumber) throw new Error('PST number required');
            value.pstRate = province === 'SK' ? taxRates.PST.SK : taxRates.PST.default;
          }
        }
      }
    },
    menuDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidMenu(value) {
          if (!Array.isArray(value)) {
            throw new Error('Menu details must be an array');
          }
          value.forEach(item => {
            if (!item.name || !item.price || !item.imageUrl) {
              throw new Error('Each menu item must have name, price, and image');
            }
            if (!item.imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
              throw new Error('Menu images must be high quality (JPG/PNG format)');
            }
            if (typeof item.price !== 'number' || item.price <= 0) {
              throw new Error('Menu item price must be a positive number');
            }
          });
        }
      }
    },
    hoursOfOperation: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidHours(value) {
          if (!Array.isArray(value)) {
            throw new Error('Hours must be an array');
          }
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
          
          value.forEach(schedule => {
            if (!days.includes(schedule.day)) {
              throw new Error('Invalid day of week');
            }
            if (!timeFormat.test(schedule.openTime) || !timeFormat.test(schedule.closeTime)) {
              throw new Error('Invalid time format (use HH:MM, 24-hour format)');
            }
            
            const open = schedule.openTime.split(':').map(Number);
            const close = schedule.closeTime.split(':').map(Number);
            const openMinutes = open[0] * 60 + open[1];
            const closeMinutes = close[0] * 60 + close[1];
            
            if (closeMinutes <= openMinutes) {
              throw new Error('Closing time must be after opening time');
            }
          });
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    hooks: {
      beforeValidate: (restaurant) => {
        if (restaurant.taxInfo && !restaurant.taxInfo.province) {
          restaurant.taxInfo.province = restaurant.province;
        }
      }
    }
  });

  return Restaurant;
};
