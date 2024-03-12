// OrderItemID (Primary Key)
// OrderID (Foreign Key referencing Orders Table)
// ProductID (Foreign Key referencing Products Table)
// Quantity
// UnitPrice

const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = OrderItem;