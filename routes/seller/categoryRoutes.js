const router= require('express').Router();
const configureMulter = require('../../utils/multerConfig');
const verifyToken = require('../../middlewares/verifyToken');

const { createCategory,
     getAllCategories, 
     getCategoryById, 
     updateCategoryById, 
    deleteCategoryById,
    getParentCategories,
    getChildCategoriesByParentId
 } = require('../../controllers/seller/categoryControllers')

const upload = configureMulter('uploads/categories');

router.get('/parent', getParentCategories);
router.get('/child/:id', getChildCategoriesByParentId);

router.post('/',verifyToken, upload.single('image'), createCategory);
router.get('/', getAllCategories);

router.get('/:id', getCategoryById);
router.put('/:id',verifyToken, updateCategoryById);
router.delete('/:id',verifyToken, deleteCategoryById);




module.exports = router;
