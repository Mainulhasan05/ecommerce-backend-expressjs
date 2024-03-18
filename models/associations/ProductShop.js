const Product=require('../common/productModel');
const Shop=require('../../models/seller/shopModel');

Product.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });