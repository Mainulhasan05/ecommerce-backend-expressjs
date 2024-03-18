const router = require('express').Router();
const {getHomeData}=require('../../controllers/frontend/homeControllers');
const {getProductBySlug,getAllProducts}=require('../../controllers/frontend/productController');
const {getAllShops}=require('../../controllers/frontend/shopControllers');

router.get('/',getHomeData);
router.get('/products',getAllProducts);
router.get('/product/:slug',getProductBySlug);

router.get('/shops',getAllShops);






module.exports = router;