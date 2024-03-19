const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = Order;