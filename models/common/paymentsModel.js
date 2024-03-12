// PaymentID (Primary Key)
// OrderID (Foreign Key referencing Orders Table)
// PaymentDate
// PaymentAmount
// PaymentMethod

const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = Payment;