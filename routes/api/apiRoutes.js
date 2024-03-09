const router = require('express').Router();
const {getHomeData}=require('../../controllers/frontend/homeControllers');

router.get('/',getHomeData);


module.exports = router;