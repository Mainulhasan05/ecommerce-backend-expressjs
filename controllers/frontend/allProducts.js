const { Op } = require('sequelize');
const Product = require('../../models/common/productModel');
const sendResponse = require('../../utils/sendResponse');

exports.getAllProducts = async (req, res) => {
    try {
        // Get page, price range, price=asc/desc,
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const priceRange = req.query.priceRange || "0-100000";
        const price = req.query.price || "asc";
        const search = req.query.search || "";

        let query = {};
        if (search) {
            query.name = { [Op.like]: `%${search}%` };
        }
        if (priceRange) {
            const priceArr = priceRange.split("-");
            query.new_price = { [Op.gte]: parseInt(priceArr[0], 10), [Op.lte]: parseInt(priceArr[1], 10) };
        }

        let sortQuery = [];

        if (price === "asc") {
            sortQuery.push(['new_price', 'ASC']);
        } else {
            sortQuery.push(['new_price', 'DESC']);
        }
        const attributes = ['id', 'name', 'new_price', 'old_price', 'slug'];

        const products = await Product.findAll({
            attributes,
            where: query,
            order: sortQuery,
            limit: limit,
            offset: (page - 1) * limit
        });

        const totalProducts = await Product.count({
            where: query
        });

        const totalPages = Math.ceil(totalProducts / limit);

        sendResponse(res, 200, true, "All Products", {
            products,
            totalPages,
            totalProducts,
            currentPage: page
        });
    } catch (err) {
        sendResponse(res, 500, false, err.message, err);
    }
};
