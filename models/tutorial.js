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
      profileId: DataTypes.INTEGER,
      profilePage: DataTypes.BOOLEAN,
      sharePage: DataTypes.BOOLEAN,
      connectionPage: DataTypes.BOOLEAN,
      profileScan: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Tutorial',
    }
  );
  return Tutorial;
};
