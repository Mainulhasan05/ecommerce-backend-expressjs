const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');
const {addBanner, getBanners, updateBanner, deleteBanner} = require('../../controllers/seller/bannerControllers');
const {createShop, getMyShop, getShop, deleteShop, updateShop,getShops} = require('../../controllers/seller/shopControllers');

const verifyToken = require('../../middlewares/verifyToken');

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile',verifyToken, getProfile);

// banner routes
router.post('/banner',verifyToken, addBanner);
router.get('/banner', getBanners);
router.put('/banner/:id',verifyToken, updateBanner);
router.delete('/banner/:id',verifyToken, deleteBanner);

// shop routes
router.post('/shop',require('../../utils/multerConfig')('uploads/shops').single('image'),verifyToken, createShop);
router.get('/shop/:id', getShop);
router.get('/shops', getShops);
router.put('/shop/:id',require('../../utils/multerConfig')('uploads/shops').single('image'),verifyToken, updateShop);
router.delete('/shop/:id',verifyToken, deleteShop);
router.get('/my-shop',verifyToken, getMyShop);


module.exports = router;
