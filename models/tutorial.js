'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutorial extends Model {
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: 'accountId',
        onDelete: 'CASCADE',
      });
    }
  }
  Tutorial.init(
    {
      accountId: DataTypes.INTEGER,
      profilePage: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      sharePage: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      connectionPage: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      profileScan: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Tutorial',
    }
  );
  return Tutorial;
};
