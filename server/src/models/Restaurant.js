const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class Restaurant extends Model {
    static associate(models) {
      // No associations needed
    }

    async comparePassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
  }

  Restaurant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAdult(value) {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (age < 21) {
            throw new Error('Must be at least 21 years old');
          }
        }
      }
    },
    cellNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\+1-\d{3}-\d{3}-\d{4}$/
      }
    },
    streetNameNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appUniteNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
      }
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
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
    identificationType: {
      type: DataTypes.ENUM('licence', 'pr_card', 'passport', 'medical_card', 'provincial_id'),
      allowNull: false
    },
    businessDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: false
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
          if (!/^\d{5}$/.test(value.transitNumber)) {
            throw new Error('Transit number must be 5 digits');
          }
          if (!/^\d{3}$/.test(value.institutionNumber)) {
            throw new Error('Institution number must be 3 digits');
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
      validate: {
        hasRequiredFields(value) {
          const required = ['gstNumber', 'pstNumber', 'businessNumber'];
          for (const field of required) {
            if (!value[field]) {
              throw new Error(`Tax info missing ${field}`);
            }
          }
        }
      }
    },
    menuDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    hoursOfOperation: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    hooks: {
      beforeSave: async (restaurant) => {
        if (restaurant.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          restaurant.password = await bcrypt.hash(restaurant.password, salt);
        }
      }
    }
  });

  return Restaurant;
};
