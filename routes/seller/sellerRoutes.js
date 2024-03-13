const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');
const { addBanner, getBanners, updateBanner, deleteBanner } = require('../../controllers/seller/bannerControllers');
const { createShop, getMyShop, getShop, deleteShop, updateShop, getShops } = require('../../controllers/seller/shopControllers');
const { getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct } = require('../../controllers/seller/productControllers');

const verifyToken = require('../../middlewares/verifyToken');

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

// banner routes
router.post('/banner', verifyToken, require('../../utils/multerConfig')('uploads/banner').single('image'), addBanner);
router.get('/banner', getBanners);
router.put('/banner/:id', verifyToken, require('../../utils/multerConfig')('uploads/banner').single('image'), updateBanner);
router.delete('/banner/:id', verifyToken, deleteBanner);

// shop routes
router.post('/shop', require('../../utils/multerConfig')('uploads/shops').single('image'), verifyToken, createShop);
router.get('/shop/:id', getShop);
router.get('/shops', getShops);
router.put('/shop/:id', require('../../utils/multerConfig')('uploads/shops').single('image'), verifyToken, updateShop);
router.delete('/shop/:id', verifyToken, deleteShop);
router.get('/my-shop', verifyToken, getMyShop);

// product routes, multiple images upload
router.post('/product', require('../../utils/multerConfig')('uploads/products').array('images', 5), verifyToken, createProduct);
router.get('/product/:id', getProductById);
router.get('/products',verifyToken, getAllProducts);
router.put('/product/:id', verifyToken, updateProduct);
router.delete('/product/:id', verifyToken, deleteProduct);



module.exports = router;
