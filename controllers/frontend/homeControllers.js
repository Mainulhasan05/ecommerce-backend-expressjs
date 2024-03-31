const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const Product = require('../../models/common/productModel');
const Banner =require('../../models/common/bannerModel');
const { Op } = require('sequelize');

const sendResponse = require('../../utils/sendResponse');
const getHomeData = async (req, res) => {
    const categories = await Category.findAll({
        attributes: ['id', 'name', 'slug', 'image', 'sortValue'],
        where: {
            [Op.or]: {
                parentId: null,
                sideMenu: true
              },
        },
        limit: 10,
        order: [['sortValue', 'DESC']]
    });
    const featuredCategories = await Category.findAll({
        attributes: ['id', 'name', 'slug', 'image'],
        limit: 18,
        order: [['sortValue', 'DESC']],
        where: {
            isFeatured: true
        }
    });
    const shops = await Shop.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image',],
        order: [['sortValue','DESC'],['createdAt', 'DESC']],
        where: {
            status: 'active'
        }
    });
    const newArrivals = await Product.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity'],
        order: [['createdAt', 'DESC']],
        where: {
            status: 'active'
        }
    });
    const trendingProducts = await Product.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity'],
        order: [['views', 'DESC']],
        where: {
            status: 'active'
        }
    });

    const bestSellingProducts = await Product.findAll({
        limit: 10,
        attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity'],
        order: [['sold', 'DESC']],
        where: {
            status: 'active'
        }
    });
    
    const banners=await Banner.findAll({
        limit: 10,
        attributes: ['id','imageUrl','buttonText','pageUrl',],
        order: [['sortValue', 'DESC']],
        where: {
            status: 'active'
        }
    });

    const data = {
        banners,
        categories,
        featuredShops: shops,
        newArrivals,
        trendingProducts,
        bestSellingProducts,
        featuredCategories
    }
    return sendResponse(res, 200, true, 'Home data retrieved successfully', data);


}

module.exports = {
    getHomeData
};