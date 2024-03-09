const Product=require('../common/productModel');
const Image=require('../common/product_helpers/imageModel');

Product.hasMany(Image, { as: 'images' });
Image.belongsTo(Product);