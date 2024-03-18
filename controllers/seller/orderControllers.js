const Order=require('../../models/seller/orderModel');
const OrderItem=require('../../models/seller/orderItems');
const Product=require('../../models/common/productModel');
const sendResponse=require('../../utils/sendResponse');


exports.createOrder=async(req,res)=>{
    try{
        const { customerName, customerPhoneNumber, customerAddress, totalAmount, paymentMethod, status, paymentStatus, deliveryCharge } = req.body;
        // validate request
        if (!customerName || !customerPhoneNumber || !customerAddress, productId, quantity, price, variationId) {
            sendResponse(res,400,"Fill Up All Fields",null);
            return;
        }
    }
    catch(err){
        sendResponse(res,500,"Internal Server Error",err);
    }
}