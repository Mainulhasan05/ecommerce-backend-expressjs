const Product=require('../common/productModel');
const ProductImages=require('../common/product_helpers/productImagesModel');

Product.hasMany(ProductImages, { foreignKey: 'productId', as: 'images'});

