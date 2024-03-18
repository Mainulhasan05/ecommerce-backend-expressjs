const Product = require('../common/productModel');
const Order = require('../seller/orderModel');
const OrderItem = require('../seller/orderItems');

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });


