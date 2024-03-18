const Product = require('../../models/common/productModel');
const ProductImage = require('../../models/common/product_helpers/productImagesModel');
const Shop=require('../../models/seller/shopModel');
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
        // Check if the seller has a shop, ownerId
        const shop = await Shop.findOne({
            where: {
                ownerId: sellerId
            }
        });

        if (!shop) {
            return sendResponse(res, 400, false, 'You need to create a shop before you can add products');
        }

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
            status,
            shopId: shop.id
        });
        // shop,productCount
        

        await product.addCategories(categoryIds);
        let imageUrl="";
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({
                productId: product.id,
                url: `/${file.path}`
            }));


            await ProductImage.bulkCreate(images);
            
            await Product.update({ image: images[0].url }, { where: { id: product.id } });
            imageUrl=images[0].url;
            
        }
        await Shop.update({productCount:shop.productCount+1},{where:{id:shop.id}});
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

// handle product deletion
// write full code for this function
const deleteProduct = async (req, res) => {
    try {
        // delete all images, product, decrease shop productCount
        const productId = req.params.productId;
        const product = await Product.findByPk(productId);
        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }
        const shop = await Shop.findByPk(product.shopId);
        if (!shop) {
            return sendResponse(res, 404, false, 'Shop not found');
        }
        // delete all images from storage
        const images = await ProductImage.findAll({
            where: {
                productId
            }
        });
        images.forEach(image => {
            deleteImage(image.url);
        });
        await ProductImage.destroy({
            where: {
                productId
            }
        });
        await Product.destroy({
            where: {
                id: productId
            }
        });
        await Shop.update({productCount:shop.productCount-1},{where:{id:shop.id}});
        sendResponse(res, 200, true, 'Product deleted successfully');
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
