const { Op } = require('sequelize');
const Product = require('../../models/common/productModel');
const Category = require('../../models/common/categoryModel');
const sendResponse = require('../../utils/sendResponse');

exports.getAllProducts = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 20) || 20;
        const priceRange = req.query.priceRange || "0-100000";
        const price = req.query.price || "asc";
        const search = req.query.search || "";
        const categorySlug = req.query.category;

        let query = {};
        if (search) {
            query.name = { [Op.like]: `%${search}%` };
        }
        if (priceRange) {
            const priceArr = priceRange.split("-");
            query.new_price = { [Op.gte]: parseInt(priceArr[0], 10), [Op.lte]: parseInt(priceArr[1], 10) };
        }

        let sortQuery = [];
        
        

        if (req.query.price === "asc") {
            sortQuery.push(['new_price', 'ASC']);
        }
        if(req.query.price === "desc") {
            sortQuery.push(['new_price', 'DESC']);
        }
        sortQuery.push(['createdAt', 'DESC']);
        const attributes = ['id', 'name', 'new_price', 'old_price', 'slug','image'];
        let products;
        if (categorySlug) { // New: Check if category slug is present
            // Fetch products filtered by category slug
            products = await Product.findAll({
                attributes,
                include: [{
                    model: Category,
                    where: { slug: categorySlug },
                    attributes: [],
                }],
                where: query,
                order: sortQuery,
                limit: limit,
                offset: (page - 1) * limit
            });
        } else {
            // Fetch all products without filtering by category
            products = await Product.findAll({
                attributes,
                where: query,
                order: sortQuery,
                limit: limit,
                offset: (page - 1) * limit
            });
        }
        const totalProducts = await Product.count({
            where: query
        });

        const totalPages = Math.ceil(totalProducts / limit);

        sendResponse(res, 200, true, "All Products", {
            products,
            totalPages,
            totalProducts,
            currentPage: page,
            per_page: limit
        });
    } catch (err) {
        sendResponse(res, 500, false, err.message, err);
    }
};
