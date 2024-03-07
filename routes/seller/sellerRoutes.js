const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');

// Seller register
router.post('/register', register);

// Seller login
router.post('/login', login);

// Seller profile
router.get('/profile', getProfile);

module.exports = router;
