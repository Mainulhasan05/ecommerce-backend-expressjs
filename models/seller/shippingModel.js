// Shipping Table (Optional, if you need to track shipping information):

// ShippingID (Primary Key)
// OrderID (Foreign Key referencing Orders Table)
// ShippingDate
// ShippingMethod
// TrackingNumber

const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Shipping = sequelize.define('Shipping', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shippingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    shippingMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = Shipping;