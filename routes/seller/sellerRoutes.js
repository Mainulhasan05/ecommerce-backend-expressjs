const express = require('express');
const router = express.Router();
const { register, login, getProfile,getRecentlyActiveSellers } = require('../../controllers/seller/sellerControllers');
const { addBanner, getBanners, updateBanner, deleteBanner } = require('../../controllers/seller/bannerControllers');
const { createShop, getMyShop, getShop, deleteShop, updateShop, getShops } = require('../../controllers/seller/shopControllers');
const { getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct } = require('../../controllers/seller/productControllers');
const orderControllers =  require('../../controllers/seller/orderControllers');

const {getDashboard}=require('../../controllers/seller/dashboardControllers');
    // activity
    const {getAllActivities,getActivitiesForSeller}=require('../../controllers/trackActivityController');

const verifyToken = require('../../middlewares/verifyToken');

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get('/get', getRecentlyActiveSellers);
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
router.put('/product/:id', verifyToken,require('../../utils/multerConfig')('uploads/products').array('images', 5), updateProduct);
router.post('/product',verifyToken, require('../../utils/multerConfig')('uploads/products').array('images', 5), verifyToken, createProduct);
router.get('/product/:id', getProductById);
router.get('/products',verifyToken, getAllProducts);

router.delete('/product/:id', verifyToken, deleteProduct);

// activity routes
router.get('/activities',verifyToken,getAllActivities);
router.get('/activities/:id',verifyToken,getActivitiesForSeller);

// dashboard
router.get('/dashboard',verifyToken,getDashboard);

// order routes
router.get('/orders', verifyToken, orderControllers.getAllOrdersForSeller);
router.get('/order/:id', verifyToken, orderControllers.getSingleOrderDetails);



module.exports = router;
