const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');
const OrderItems=require('./orderItems');

const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerAddress: {
        type: DataTypes.STRING,
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
        type: DataTypes.INTEGER,
        allowNull: true
    }
  },{
    timestamps: true,
  });



module.exports = Order;