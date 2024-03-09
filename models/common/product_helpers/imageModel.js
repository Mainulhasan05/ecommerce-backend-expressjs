const { DataTypes } = require('sequelize');
const sequelize = require('../../../db_config/db');

const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
  },{
    timestamps: true,
  });

module.exports = Image;