const Shop=require('../../models/seller/shopModel');
const sendResponse = require('../../utils/sendResponse');

const createShop = async (req, res) => {
    const { name, description,deliveryChargeInsideChapai,deliveryChargeOutsideChapai } = req.body;
    try {
        const ownerId = req.id;
        let slug = name.toLowerCase().split(' ').join('-');
        console.log(req.file)
        const image ="/"+ req.file.path;
        // check if the shop already exists by slug, then add time
        const exists=await Shop.findOne({where:{slug}});
        if(exists){
            slug+=Date.now();
        }
        const status="active"
        const shop = await Shop.create({ name, slug, image, description,deliveryChargeInsideChapai,deliveryChargeOutsideChapai, ownerId,status });
        sendResponse(res, 201,true,"Shop Created Successfully", shop);
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path);
        }
        sendResponse(res, 500, error);
    }
};

const getShop = async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findByPk(id);
        if (!shop) {
            sendResponse(res, 404, { message: 'Shop not found' });
        } else {
            sendResponse(res, 200, shop);
        }
    }
    catch (error) {
        sendResponse(res, 500, error);
    }
}

// delete, update, getshops
const deleteShop = async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findByPk(id);
        if (!shop) {
            sendResponse(res, 404, { message: 'Shop not found' });
        } else {
            await shop.destroy();
            sendResponse(res, 200, { message: 'Shop deleted' });
        }
    }
    catch (error) {
        sendResponse(res, 500, error);
    }
}

// images will be uploaded, req.file.filename will be used to save the image
const updateShop = async (req, res) => {
    const { id } = req.params;
    const { name, slug, image } = req.body;
    try {
        const shop = await Shop.findByPk(id);
        if (!shop) {
            sendResponse(res, 404, { message: 'Shop not found' });
        } else {
            shop.name = name;
            shop.slug = slug;
            shop.image = image;
            await shop.save();
            sendResponse(res, 200, shop);
        }
    }
    catch (error) {
        sendResponse(res, 500, error);
    }
}

const getShops = async (req, res) => {
    try {
        const shops = await Shop.findAll();
        sendResponse(res, 200, shops);
    }
    catch (error) {
        sendResponse(res, 500, error);
    }
}

const getMyShop = async (req, res) => {
    try {
        const ownerId = req.id;
        const shop = await Shop.findOne({where:{ownerId}});
        if (!shop) {
            sendResponse(res, 404, { message: 'Shop not found' });
        } else {
            sendResponse(res, 200,true,"Shop Fetched Successfully", shop);
        }
    }
    catch (error) {
        
        sendResponse(res, 500, error);
    }
}

module.exports = { createShop, getShop, deleteShop, updateShop, getShops,getMyShop };
