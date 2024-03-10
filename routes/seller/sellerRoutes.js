const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');
const {addBanner, getBanners, updateBanner, deleteBanner} = require('../../controllers/seller/bannerControllers');
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

module.exports = router;
