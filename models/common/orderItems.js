
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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'partially paid', 'completed','refund','failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    productVariationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
  },{
    timestamps: true,
  });

module.exports = OrderItem;