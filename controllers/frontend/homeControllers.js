const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const sendResponse = require('../../utils/sendResponse');
const getHomeData=async(req,res)=>{
    // get 10 categories, descending of sortValue
    const categories = await Category.findAll({
        limit: 10,
        order: [['sortValue', 'DESC']]
    });
    const shops = await Shop.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        // include: {
        //     model: Category,
        //     attributes: ['name']
        // }
    });
    const data={
        categories,
        featuredShops:shops
    
    }
    return sendResponse(res, 200, true, 'Home data retrieved successfully', data);
    

}

module.exports = {
  getHomeData
};