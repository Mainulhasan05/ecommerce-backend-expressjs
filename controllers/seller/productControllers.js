const Product = require('../../models/common/productModel');
const ProductImage = require('../../models/common/product_helpers/productImagesModel');
const sendResponse = require('../../utils/sendResponse');
const deleteImage = require('../../utils/deleteImage');
const generateSlug = require('../../utils/generateSlug');

const getAllProducts = async (req, res) => {
    try {
        const sellerId = req.id;
        const products = await Product.findAll({
            where: {
                sellerId
            },
            attributes: ['id', 'name', 'slug', 'image','old_price', 'new_price', 'quantity', 'status'],
            // include: [
            //     {
            //         model: ProductImage,
            //         attributes: ['url'],
            //         as: 'images'
            //     }
            // ]
        });

        sendResponse(res, 200, true, 'Products fetched successfully', products);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, old_price, new_price, categoryIds, quantity,status } = req.body;
        const sellerId = req.id;
        let slug = generateSlug(name);
        // Check if the slug already exists
        const productExists = await Product.findOne({
            where: {
                slug
            }
        });

        if (productExists) {
            slug = `${slug}-${Date.now()}`;
        }
        


        let product = await Product.create({
            name,
            slug,
            description,
            old_price,
            new_price,
            quantity,
            sellerId,
            status
        });

        // Create product categories
        await product.addCategories(categoryIds);
        let imageUrl="";
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({
                productId: product.id,
                url: `/${file.path}`
            }));

            // Create product images
            await ProductImage.bulkCreate(images);
            // Add image 0 as main image
            await Product.update({ image: images[0].url }, { where: { id: product.id } });
            imageUrl=images[0].url;
            
        }

        sendResponse(res, 201, true, 'Product created successfully', {
            id: product.id,
            name: product.name,
            slug: product.slug,
            new_price: product.new_price,
            image: imageUrl,
            status: product.status
        });
    } catch (error) {
        // If images are uploaded, delete them
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                deleteImage(file.path);
            });
        }
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

const getProductById = async (req, res) => {
    try {
        // Logic to fetch a product by ID
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        // Extract product information from the request body
        const { name, description, price } = req.body;
        const productId = req.params.productId;

        // Update the product
        await Product.update({
            name,
            description,
            price
        }, {
            where: {
                id: productId
            }
        });

        sendResponse(res, 200, true, 'Product updated successfully');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        // Logic to delete a product
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
