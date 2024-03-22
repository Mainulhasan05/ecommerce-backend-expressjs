const router = require('express').Router();
const {getHomeData}=require('../../controllers/frontend/homeControllers');
const {getProductBySlug,getAllProducts}=require('../../controllers/frontend/productController');
const {getAllShops}=require('../../controllers/frontend/shopControllers');
const allProductController=require('../../controllers/frontend/allProducts')
const {getAllCategories,getProductsByCategory}=require('../../controllers/frontend/categoryController');

router.get('/',getHomeData);
router.get('/products',getAllProducts);
router.get('/product/:slug',getProductBySlug);

// shop routes
router.get('/shops',getAllShops);

// all-product routes
router.get('/all-products',allProductController.getAllProducts);

// category routes
router.get('/categories',getAllCategories);
router.get('/category/:slug',getProductsByCategory);






module.exports = router;