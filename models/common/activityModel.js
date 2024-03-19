const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');
const Seller=require('../seller/sellerModel');

const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'activities',
    timestamps: false // Optional, if you don't want Sequelize to manage createdAt and updatedAt fields
  });

Activity.belongsTo(Seller, { foreignKey: 'sellerId' });
  
  module.exports = Activity;