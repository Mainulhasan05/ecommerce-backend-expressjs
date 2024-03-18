const ProductAttribute=require('../common/product_helpers/productAttribute');
const ProductAttributeValue=require('../common/product_helpers/attributeValue');

ProductAttribute.hasMany(ProductAttributeValue, { as: 'values' });
ProductAttributeValue.belongsTo(ProductAttribute, { through: 'ProductAttributeValues' , as: 'attribute'});
