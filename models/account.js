'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      this.hasOne(models.Tutorial, {
        foreignKey: 'accountId',
      });
    }
  }
  Account.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.ENUM('early', 'personal', 'enterprise'),
    },
    {
      sequelize,
      modelName: 'Account',
    }
  );
  return Account;
};
