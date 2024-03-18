const Shop=require('../../models/seller/shopModel');
const sendResponse = require('../../utils/sendResponse');

const getAllShops=async(req,res)=>{
    // get page and limit 20 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const shops = await Shop.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: {
            status: 'active'
        }
    });
    const data={
        shops
    }
    return sendResponse(res, 200, true, 'Shops retrieved successfully', data);
}

module.exports = {
    getAllShops
    };

