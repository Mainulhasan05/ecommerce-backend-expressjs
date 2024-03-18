const { DataTypes } = require('sequelize');
const sequelize = require('../../../db_config/db');

const ProductAttribute = sequelize.define('ProductAttribute', {
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
  modelName: 'ProductAttribute',
  tableName: 'product_attributes'
});

module.exports = ProductAttribute;
