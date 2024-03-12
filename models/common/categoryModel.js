const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sortValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
  },{
    timestamps: true,
  });

  Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
  

module.exports = Category;