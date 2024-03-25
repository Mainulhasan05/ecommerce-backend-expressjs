const Product=require('../common/productModel');
const Category=require('../common/categoryModel');

Product.belongsToMany(Category, { through: 'ProductCategories' , as: 'categories'});
Category.belongsToMany(Product, { through: 'ProductCategories' , as: 'products'});


