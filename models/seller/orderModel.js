const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Order = sequelize.define('Order', {
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.ENUM('cash', 'card', 'bkash', 'rocket', 'nagad'),
        allowNull: false,
        defaultValue: 'cash'
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
    deliveryCharge: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 60
    },
});

module.exports = Order;
