const Activity=require('../../models/common/activityModel');
const Seller=require('../../models/seller/sellerModel');
const Product=require('../../models/common/productModel');

const sendResponse=require('../../utils/sendResponse');
const {Op}=require('sequelize');


// Product.belongsTo(Seller, {foreignKey: 'sellerId', as: 'seller'});
// Seller.hasMany(Product, {foreignKey: 'sellerId', as: 'products'});
// Product.belongsTo(Shop, {foreignKey: 'shopId', as: 'shop'});
// Shop.hasMany(Product, {foreignKey: 'shopId', as: 'products'});

const  getDashboard=async(req,res)=>{
    try{
        const activities=await Activity.findAll({
            include:[{
                model:Seller,
                attributes:['name']
            }],
            order:[['createdAt','DESC']],
            limit:10
        });
        // top 3 most views products
        
        const data={
            activities,
            // topProducts,
            // topSellers
        }

        sendResponse(res,200,true,'Dashboard data fetched successfully',data);
    }
    catch(err){
        console.error('Error fetching activities:',err);
        sendResponse(res,500,false,err.message);
    }
}

module.exports = {
    getDashboard
};
