const Shop=require('../../models/seller/shopModel');
const Product=require('../../models/common/productModel');
const Seller=require('../../models/seller/sellerModel');
const sendResponse = require('../../utils/sendResponse');

const getAllShops=async(req,res)=>{
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

// 
const getProductsByShopSlug=async(req,res)=>{
    const { slug } = req.params;
    // use proper limit,price=asc/desc,priceRange=0-1000
    const limit=parseInt(req.query.limit)||20;
    const page=parseInt(req.query.page)||1;
    const offset=(page-1)*limit;

    const shop = await Shop.findOne({
        where: { slug },
        attributes: ['id', 'name', 'slug', 'image',],
        include: [
            {
                model: Seller,
                as: 'owner',
                attributes: ['id', 'name']
            }
        ]
    });
    if (!shop) {
        return sendResponse(res, 404, false, 'Shop not found');
    }

    const products = await Product.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: {
            shopId: shop.id,
            status: 'active'
        }
    });
    const totalProducts=await Product.count({
        where: {
            shopId: shop.id,
            status: 'active'
        }
    });
    const totalPages=Math.ceil(totalProducts/limit);
            // totalPages,
        // totalProducts,
        // currentPage: page,
        // per_page: limit
    const data={
        shop,
        products,
        currentPage: page,
        per_page: limit,
        totalPages,
        totalProducts

    }
    return sendResponse(res, 200, true, 'Products retrieved successfully', data);
}


module.exports = {
    getAllShops,
    getProductsByShopSlug
    };

