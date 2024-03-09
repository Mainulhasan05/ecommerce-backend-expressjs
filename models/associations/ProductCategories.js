const Product=require('../common/productModel');
const Category=require('../common/categoryModel');

Product.belongsToMany(Category, { through: 'ProductCategories' });
Category.belongsToMany(Product, { through: 'ProductCategories' });

