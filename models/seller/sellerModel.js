const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');
const Seller = sequelize.define('Seller', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
  },
  phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false
  },
  permissions: {
      type: DataTypes.ENUM('admin', 'seller'),
      allowNull: false,
      defaultValue: 'seller'
  },
  accountStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
  },
  activity: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
  },
  isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  },
  hasShop:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
  },
  totalProducts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
  },
  maxProducts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100 // Assuming a default maximum number of products
  },
  totalCategories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
  },
  maxCategories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10 // Assuming a default maximum number of categories
  },
  totalSales: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
  },
  rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
  },
  last_seen: {
      type: DataTypes.DATE,
      allowNull: true
  },
  // Add more fields as necessary
}, {
  timestamps: true,
});

module.exports = Seller;
