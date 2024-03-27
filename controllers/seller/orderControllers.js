const Order=require('../../models/common/orderModel');
const OrderItem=require('../../models/common/orderItems');
const Product=require('../../models/common/productModel');
const Seller = require('../../models/seller/sellerModel');
const {trackActivity}=require('../trackActivityController');
const sendResponse=require('../../utils/sendResponse');


exports.createOrder=async(req,res)=>{
    try{
        const { customerName, customerPhoneNumber, customerAddress,  } = req.body;
        
        if (!customerName || !customerPhoneNumber || !customerAddress, productId, quantity, price, variationId) {
            sendResponse(res,400,"Fill Up All Fields",null);
            return;
        }
    }
    catch(err){
        sendResponse(res,500,"Internal Server Error",err);
    }
}


exports.getAllOrdersForSeller = async (req, res) => {
    const sellerId = req.id;

    try {
        // Fetch all order items associated with the seller
        const orderItems = await OrderItem.findAll({
            where: { sellerId: sellerId },
        });

        const orderIds = orderItems.map(orderItem => orderItem.orderId);

        // Fetch orders associated with the order IDs
        const orders = await Order.findAll({
            where: { id: orderIds },
            include: [
                { 
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        { model: Seller, as: 'seller' }
                    ],
                    where:{
                        sellerId
                    }
                }
            ]
        });

        return sendResponse(res, 200, true,'Orders fetched successfully', orders);
    } catch (error) {
        console.error('Error fetching orders for seller:', error);
        return sendResponse(res, 500, error.message, null);
    }
};