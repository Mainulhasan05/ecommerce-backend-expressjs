const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const Product = require('../../models/common/productModel');


const sendResponse = require('../../utils/sendResponse');
const getHomeData=async(req,res)=>{
    // get 10 categories, descending of sortValue
    const categories = await Category.findAll({
        limit: 10,
        order: [['sortValue', 'DESC']]
    });
    const shops = await Shop.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image',],
        order: [['createdAt', 'DESC']],
        where: {
            status: 'active'
        }
        // include: {
        //     model: Category,
        //     attributes: ['name']
        // }
    });
    const newArrivals = await Product.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity'],
        order: [['createdAt', 'DESC']],
        where: {
            status: 'active'
        }
    });
    const data={
        categories,
        featuredShops:shops,
        newArrivals    
    }
    return sendResponse(res, 200, true, 'Home data retrieved successfully', data);
    

}

module.exports = {
  getHomeData
};