const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const Product = require('../../models/common/productModel');
const { Op } = require('sequelize');
const sendResponse = require('../../utils/sendResponse');

// get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const slug = req.params.slug || req.query.slug;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 20) || 20;
        const priceRange = req.query.priceRange || "0-100000";
        const price = req.query.price || "asc";

        let query = {};
        if (priceRange) {
            const priceArr = priceRange.split("-");
            query.new_price = { [Op.gte]: parseInt(priceArr[0], 10), [Op.lte]: parseInt(priceArr[1], 10) };
        }
        if(req.query?.price === "asc"){
            query.new_price = { [Op.gte]: 0, [Op.lte]: 100000 };
        }
        if(req.query?.price === "desc"){
            query.new_price = { [Op.gte]: 0, [Op.lte]: 100000 };
        }
        let sortQuery = [];
        sortQuery.push(['createdAt', 'DESC']);

        if (price === "asc") {
            sortQuery.push(['new_price', 'ASC']);
        }
        if(price === "desc"){
            sortQuery.push(['new_price', 'DESC']);
        }
        const category = await Category.findOne({
            where: { slug },
            attributes: ['id', 'name', 'slug', 'image','description'],
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: [] },                    
                }
            ]
        });
        if (!category) {
            return sendResponse(res, 404, false, 'Category not found');
        }
        sendResponse(res, 200, true, 'Products fetched successfully', category);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message,error);
    }
};

// get all categories with their children categories name, slug
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'slug', 'image', 'sortValue'],
            include: [
                {
                    model: Category,
                    as: 'children',
                    attributes: ['id', 'name', 'slug', 'image', 'sortValue'],
                    order: [[{ model: Category, as: 'children' }, 'sortValue', 'DESC']]
                }
            ],
            where: {
                parentId: null
            },
            limit: 10,
            order: [['sortValue', 'DESC']]
        });
        sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, 'Server Error', null);
    }
};

module.exports = { getProductsByCategory, getAllCategories };