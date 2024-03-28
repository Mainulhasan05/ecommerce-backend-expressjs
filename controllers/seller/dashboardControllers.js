const Activity=require('../../models/common/activityModel');
const Seller=require('../../models/seller/sellerModel');
const Product=require('../../models/common/productModel');
const Order=require('../../models/common/orderModel');
const Shop=require('../../models/seller/shopModel');
const Category=require('../../models/common/categoryModel');
const OrderItems=require('../../models/common/orderItems');
const sequelize=require('sequelize');


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
            limit:2
        });
        // top 3 most views products of a seller
        const mostViewed=await Product.findAll({
            where:{sellerId:req.id},
            attributes:['id','name','views','image','slug'],
            order:[['views','DESC']],
            limit:3
        });
        

        const totalOrders=await OrderItems.count({
            where:{sellerId:req.id},
            distinct:true,
            col:'orderId'
        })

        
        

        // count total orders


        
        const data={
            activities,
            mostViewed,
            totalOrders
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
