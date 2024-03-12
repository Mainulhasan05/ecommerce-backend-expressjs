// ReviewID (Primary Key)
// ProductID (Foreign Key referencing Products Table)
// CustomerID (Foreign Key referencing Customers Table)
// Rating
// Comment
// ReviewDate

const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reviewDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
  },{
    timestamps: true,
  });

module.exports = Review;