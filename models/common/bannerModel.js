const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

const Banner = sequelize.define('Banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'home'
    },
    sortValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/'
    },
    buttonText:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
});

module.exports = Banner;