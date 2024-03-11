const Shop=require('../../models/seller/shopModel');
const Seller=require('../../models/seller/sellerModel');
const { Op } = require("sequelize");
const sendResponse = require('../../utils/sendResponse');

const createShop = async (req, res) => {
    const { name, description,deliveryChargeInsideChapai,deliveryChargeOutsideChapai } = req.body;
    try {
        const ownerId = req.id;
        let slug = name.toLowerCase().split(' ').join('-');
        
        const image ="/"+ req.file.path;
        // check if the shop already exists by slug, then add time
        const exists=await Shop.findOne({where:{slug}});
        if(exists){
            slug+=Date.now();
        }

        const status="active"
        const shop = await Shop.create({ name, slug, image, description,deliveryChargeInsideChapai,deliveryChargeOutsideChapai, ownerId,status });
        // update seller with hasShop=1
        const seller = await Seller.findByPk(ownerId);
        seller.hasShop=1;
        await seller.save();
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
    const { name, description, deliveryChargeInsideChapai, deliveryChargeOutsideChapai, location } = req.body;
    
    try {
        const shop = await Shop.findByPk(id);
        
        if (!shop) {
            return sendResponse(res, 404, { message: 'Shop not found' });
        }
        
        // Update only if the fields are present in the request body
        if (name) {
            shop.name = name;
            shop.slug = name.toLowerCase().split(' ').join('-');
            const exists = await Shop.findOne({ where: { slug: shop.slug, id: { [Op.ne]: id } } });
            if (exists) {
                shop.slug += Date.now();
            }
        }

        if (description) {
            shop.description = description;
        }

        if (deliveryChargeInsideChapai) {
            shop.deliveryChargeInsideChapai = deliveryChargeInsideChapai;
        }

        if (deliveryChargeOutsideChapai) {
            shop.deliveryChargeOutsideChapai = deliveryChargeOutsideChapai;
        }

        if (location) {
            shop.location = location;
        }

        if (req.file) {
            const newImagePath = `/${req.file.path}`;
            if (shop.image) {
                try {
                    await fs.unlink(shop.image); 
                } catch (error) {
                    console.error('Error deleting previous image:', error);
                }
            }
            
            shop.image = newImagePath;
        }

        // Save the updated shop
        await shop.save();

        return sendResponse(res, 200, true, "Shop Updated Successfully", shop);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, "Internal Server Error", error);
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
