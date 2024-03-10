const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/seller/sellerControllers');
const verifyToken = require('../../middlewares/verifyToken');

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile',verifyToken, getProfile);

// banner routes
module.exports = router;
