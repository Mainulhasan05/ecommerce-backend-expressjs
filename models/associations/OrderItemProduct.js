const Product = require('../common/productModel');
const Order=require('../common/orderModel');
const OrderItem=require('../common/orderItems');

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });


