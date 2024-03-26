const Order=require('../../models/common/orderModel');
const OrderItem=require('../../models/common/orderItems');
const Product=require('../../models/common/productModel');
const {trackActivity}=require('../trackActivityController');
const sendResponse=require('../../utils/sendResponse');

const { DataTypes } = require('sequelize');
const sequelize = require('../../db_config/db');

// const Order = sequelize.define('Order', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     customerName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     customerPhoneNumber: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     customerAddress: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     orderDate: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: new Date()
//     },
//     note: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     }
//   },{
//     timestamps: true,
//   });


// const { DataTypes } = require('sequelize');
// const sequelize = require('../../db_config/db');
// const Product = require('../common/productModel')

// const OrderItem = sequelize.define('OrderItem', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     orderId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     unitPrice: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     status: {
//         type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
//         allowNull: false,
//         defaultValue: 'pending'
//     },
//     paymentStatus: {
//         type: DataTypes.ENUM('pending', 'partially paid', 'completed','refund','failed'),
//         allowNull: false,
//         defaultValue: 'pending'
//     },
//     productVariationId: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//   },{
//     timestamps: true,
//   });

// OrderItem.belongsTo(Product, {foreignKey: 'productId', as: 'product'});

// receiving fields from frontend, name, phone, address, productId, quantity, note, product id is array [12,36,45] like this

exports.createOrder=async(req,res)=>{
    try{
        const {name, phone, address, productIds, quantity, note} = req.body;
        if (!name || !phone || !address || !productIds || !quantity) {
            sendResponse(res,400,"Fill Up All Fields",null);
            return;
        }
        // check if all product ids are valid
        const products = await Product.findAll({where: {id: productIds}});
        if (products.length !== productIds.length) {
            sendResponse(res,400,"Invalid Product Ids",null);
            return;
        }
        // calculate total amount
        let totalAmount = 0;
        for (let i = 0; i < products.length; i++) {
            totalAmount += products[i].new_price * quantity[i];
        }
        // create order
        const order = await Order.create({
            customerName: name,
            customerPhoneNumber: phone,
            customerAddress: address,
            note,
            totalAmount
        });
        // create order items
        for (let i = 0; i < products.length; i++) {
            await OrderItem.create({
                orderId: order.id,
                productId: products[i].id,
                quantity: quantity[i],
                unitPrice: products[i].new_price,
                sellerId: products[i].sellerId,
                totalAmount: products[i].new_price * quantity[i]
            });
        }
        
        // trackActivity(1, `Order Created: ${order.id}`);
        sendResponse(res,201,"Order Created",order);
    }
    catch(err){
        sendResponse(res,500,err.message,err);
    }
}

exports.getOrders=async(req,res)=>{
    try{
        const orders=await Order.findAll({include:OrderItem});
        sendResponse(res,200,"All Orders",orders);
    }
    catch(err){
        sendResponse(res,500,err.message,err);
    }
}

exports.getOrder=async(req,res)=>{
    try{
        const order=await Order.findByPk(req.params.id,{include:OrderItem});
        if(!order){
            sendResponse(res,404,"Order Not Found",null);
            return;
        }
        sendResponse(res,200,"Order",order);
    }
    catch(err){
        sendResponse(res,500,err.message,err);
    }
}

