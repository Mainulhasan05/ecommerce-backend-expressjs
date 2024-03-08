const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');
const verifyToken = require('../../middlewares/verifyToken');
// Seller register
router.post('/register', register);

// Seller login
router.post('/login', login);

// Seller profile
router.get('/profile',verifyToken, getProfile);

module.exports = router;
