const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const Product = require('../../models/common/productModel');
const sendResponse = require('../../utils/sendResponse');

// get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({
            where: {
                slug
            },
            attributes:['id','name','slug','image',],
            include: [
                {
                    model: Category,
                    as: 'children',
                    include: [
                        {
                            model: Product,
                            as: 'products',
                            attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity', 'status'],
                            where: {
                                status: 'active'
                            },
                            through: {
                                attributes: []
                            }
                        }
                    ]
                },
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'quantity', 'status'],
                    where: {
                        status: 'active'
                    },
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        
        sendResponse(res, 200, true, 'Products fetched successfully', category);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
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