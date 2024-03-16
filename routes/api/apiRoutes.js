const router = require('express').Router();
const {getHomeData}=require('../../controllers/frontend/homeControllers');
const {getProductBySlug,getAllProducts}=require('../../controllers/frontend/productController');


router.get('/',getHomeData);
router.get('/products',getAllProducts);
router.get('/product/:slug',getProductBySlug);





module.exports = router;