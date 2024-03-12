const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    old_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    new_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    sortValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },{
    timestamps: true,
  });
    module.exports = Product;