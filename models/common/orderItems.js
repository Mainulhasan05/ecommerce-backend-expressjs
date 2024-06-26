
const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');
const Product = require('../common/productModel')
const Seller = require('../seller/sellerModel')
const Order=require('./orderModel');

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
    sellerId: {
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

Order.hasMany(OrderItem, {foreignKey: 'orderId', as: 'orderItems'});
OrderItem.belongsTo(Product, {foreignKey: 'productId', as: 'product'});
OrderItem.belongsTo(Seller, {foreignKey: 'sellerId', as: 'seller'});


module.exports = OrderItem;