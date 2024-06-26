const Product = require('../../models/common/productModel');
const ProductImage = require('../../models/common/product_helpers/productImagesModel');
const Category = require('../../models/common/categoryModel');
const Shop = require('../../models/seller/shopModel');
const OrderItem = require('../../models/common/orderItems');
const Seller = require('../../models/seller/sellerModel');

const { trackActivity } = require('../trackActivityController');
const sendResponse = require('../../utils/sendResponse');
const deleteImage = require('../../utils/deleteImage');
const generateSlug = require('../../utils/generateSlug');
const sendDomainEmail = require('../../utils/sendDomainEmail');
const sizeReducer = require('../../utils/fileSizeReducer');


const getAllProducts = async (req, res) => {
    try {
        const sellerId = req.id;
        const products = await Product.findAll({
            where: {
                sellerId
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'views', 'quantity', 'status'],
            limit: 20,
        });

        sendResponse(res, 200, true, 'Products fetched successfully', products);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};
const notifySeller = async (sellerId, productName) => {
    const seller = await Seller.findByPk(sellerId);
    if (seller) {

        sendDomainEmail(process.env.SENDER_EMAIL2, 'New Product Upload',
            `<h2>New Product Notification</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Seller:</strong> ${seller.name}</p>
        <p><strong>Ordered At:</strong> ${new Date().toLocaleString()}</p>
        `);
    }
}
const createProduct = async (req, res) => {
    try {
        const { name, description, old_price, new_price, categoryIds, quantity, status } = req.body;

        if (name.length < 3) {
            trackActivity(req.id, `failed to create product ${name} for name length less than 3 characters`);
            return sendResponse(res, 400, false, 'Product name must be at least 3 characters');
        }
        if (old_price < 0 || new_price < 0) {
            trackActivity(req.id, `failed to create product ${name} for negative price`);
            return sendResponse(res, 400, false, 'Price cannot be negative');
        }

        const sellerId = req.id;

        const shop = await Shop.findOne({
            where: {
                ownerId: sellerId
            }
        });

        if (!shop) {
            return sendResponse(res, 400, false, 'You need to create a shop before you can add products');
        }

        let slug = generateSlug(name);

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

        trackActivity(sellerId, `created product ${product.name}`);


        await product.addCategories(JSON.parse(categoryIds));

        let imageUrl = "";

        if (req.files && req.files.length > 0) {
            const updatedImages = [];

            for (const file of req.files) {
                let updatedFilePath = file.path;

                if (file.size > 800 * 1024) {
                    updatedFilePath = await sizeReducer(file.path, 800);
                    deleteImage(file.path);
                }


                // Create an object representing the image to be stored in the database
                const image = {
                    productId: product.id,
                    url: `/${updatedFilePath}` // Assuming updatedFilePath contains the correct path
                };

                
                updatedImages.push(image);

            }


            // Store the images in the database
            await ProductImage.bulkCreate(updatedImages);

            // Update product information with the URL of the first image
            if (updatedImages.length > 0) {
                await Product.update({ image: updatedImages[0].url }, { where: { id: product.id } });
                imageUrl = updatedImages[0].url;
            }
        }

        // delete the original image
        // copy the original image paths into an array
        // const originalImages = req.files.map(file => file.path);
        // delete the original images
        // originalImages.forEach(image => {
        //     deleteImage(image);
        // });



        await Shop.update({ productCount: shop.productCount + 1 }, { where: { id: shop.id } });
        notifySeller(sellerId, product.name);
        sendResponse(res, 201, true, 'Product created successfully', {
            id: product.id,
            name: product.name,
            slug: product.slug,
            new_price: product.new_price,
            image: imageUrl,
            status: product.status
        });
    } catch (error) {

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                deleteImage(file.path);
            });
        }
        console.error(error);
        sendResponse(res, 500, false, error.message, error);
    }
};



const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId, {
            include: [
                {
                    model: ProductImage,
                    attributes: ['url'],
                    as: 'images'
                },
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'categories'
                }
            ]

        });

        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        sendResponse(res, 200, true, 'Product fetched successfully', product);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, error.message);
    }
};

const updateProduct = async (req, res) => {
    try {

        const { name, description, old_price, new_price, categoryIds, quantity, status } = req.body;
        const productId = req.params.id;

        // validate name,new_price, old_price, quantity, categoryIds
        if (name.length < 3) {
            trackActivity(req.id, `failed to update product ${name} for name length less than 3 characters`);
            return sendResponse(res, 400, false, 'Product name must be at least 3 characters');
        }
        if (old_price < 0 || new_price < 0) {
            trackActivity(req.id, `failed to update product ${name} for negative price`);
            return sendResponse(res, 400, false, 'Price cannot be negative');
        }
        if (categoryIds.length < 1) {
            trackActivity(req.id, `failed to update product ${name} for no category selected`);
            return sendResponse(res, 400, false, 'Select at least one category');
        }
        // check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        // check if the product belongs to the seller
        if (product.sellerId !== req.id) {
            return sendResponse(res, 403, false, 'You are not authorized to update this product');
        }
        // update product
        await Product.update({
            name,
            description,
            old_price,
            new_price,
            quantity,
            status
        }, {
            where: {
                id: productId
            }
        });
        // update categories
        await product.setCategories(JSON.parse(categoryIds));

        // update images
        if (req.files && req.files.length > 0) {
            // delete old images
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


            const newImages = req.files.map(file => ({
                productId,
                url: `/${file.path}`
            }));
            await ProductImage.bulkCreate(newImages);
            await Product.update({ image: newImages[0].url }, { where: { id: productId } });
        }
        trackActivity(req.id, `updated product ${product.name}`);

        const updatedProduct = await Product.findByPk(productId, {
            attributes: ['id', 'name', 'slug', 'image', 'old_price', 'new_price', 'views', 'quantity', 'status'],
        })

        sendResponse(res, 200, true, 'Product updated successfully', updatedProduct);

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
        const productId = req.params.id;
        const orderItem = await OrderItem.findOne({ where: { productId } });
        if (orderItem) {
            return sendResponse(res, 400, false, 'Product cannot be deleted because it is in an order');
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }
        const shop = await Shop.findByPk(product.shopId);
        if (!shop) {
            return sendResponse(res, 404, false, 'Shop not found');
        }

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
        await Shop.update({ productCount: shop.productCount - 1 }, { where: { id: shop.id } });
        await trackActivity(req.id, `deleted product ${product.name}`);
        sendResponse(res, 200, true, 'Product deleted successfully', product);
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
