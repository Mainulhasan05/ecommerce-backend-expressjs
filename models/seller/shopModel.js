const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Shop = sequelize.define('Shop', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true
  },
  description:{
    type: DataTypes.STRING,
    allowNull:true
  },
  location:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Chapai'
  },
  status:{
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: 'inactive'
  },
  deliveryChargeInsideChapai:{
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  deliveryChargeOutsideChapai:{
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sortValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  productCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  
});

module.exports = Shop;
