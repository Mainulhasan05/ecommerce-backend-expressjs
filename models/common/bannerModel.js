const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Banner = sequelize.define('Banner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sortValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
        defaultValue: 0
    },
    pageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
        defaultValue: '/'
    }
  }, {
    // Other model options
  });

module.exports = Banner;