const Product = require('../../models/common/productModel');
const ProductImage = require('../../models/common/product_helpers/productImagesModel');
const deleteImage = require('../../utils/deleteImage');
const getAllProducts = async (req, res) => {
    try {
      
        // Logic to fetch all products from the database
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const createProduct = async (req, res) => {
    try {
      
        const { name, description, old_price,new_price, categoryId,quantity, } = req.body;
        const sellerId = req.id; // Assuming the seller ID is available in the request object

        // Create the product
        const product = await Product.create({
            name,
            description,
            old_price,
            new_price,
            quantity,
            sellerId,
            categoryId
        });

        console.log(req.body);
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({
                product_id: product.id, 
                url: file.path 
            }));
            
            // Create product images
            await ProductImage.bulkCreate(images);
        }

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
      // if images are uploaded then delete them
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            deleteImage(file.path);
        });
    }
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getProductById = async (req, res) => {
    try {
        // Logic to fetch a product by ID
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
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

        res.status(200).json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        // Logic to delete a product
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
