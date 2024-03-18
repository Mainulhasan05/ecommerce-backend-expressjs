const router = require('express').Router();
const {getHomeData}=require('../../controllers/frontend/homeControllers');
const {getProductBySlug,getAllProducts}=require('../../controllers/frontend/productController');
const {getAllShops}=require('../../controllers/frontend/shopControllers');
const allProductController=require('../../controllers/frontend/allProducts')

router.get('/',getHomeData);
router.get('/products',getAllProducts);
router.get('/product/:slug',getProductBySlug);

// shop routes
router.get('/shops',getAllShops);

// all-product routes
router.get('/all-products',allProductController.getAllProducts);






module.exports = router;