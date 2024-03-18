const { DataTypes } = require('sequelize');
const sequelize = require('../../../db_config/db');

const AttributeValue = sequelize.define('AttributeValue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  modelName: 'AttributeValue',
  tableName: 'attribute_values'
});

module.exports = AttributeValue;
