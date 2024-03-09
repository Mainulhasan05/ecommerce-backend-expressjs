const Category = require('../../models/common/categoryModel');
const sendResponse = require('../../utils/sendResponse');
const getHomeData=async(req,res)=>{
    // get 10 categories, descending of sortValue
    const categories = await Category.findAll({
        limit: 10,
        order: [['sortValue', 'DESC']]
    });
    const data={
        categories
    
    }
    return sendResponse(res, 200, true, 'Home data retrieved successfully', data);
    

}

module.exports = {
  getHomeData
};