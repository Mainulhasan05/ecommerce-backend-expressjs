// OrderID (Primary Key)
// CustomerID (Foreign Key referencing Customers Table)
// OrderDate
// TotalAmount

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
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = Order;