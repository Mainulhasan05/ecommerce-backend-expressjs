const Activity=require('../models/common/activityModel');
const Seller=require('../models/seller/sellerModel');
const sendResponse=require('../utils/sendResponse');
const {Op}=require('sequelize');

const trackActivity=async(sellerId,action)=>{
    try{
        const activity=await Activity.create({
            sellerId,
            action
        });
    }
    catch(err){
        console.error(err);
    }
}

// Example of fetching activities for a seller including seller's name
const getActivitiesForSeller = async (req, res) =>{
    try {
      const activities = await Activity.findAll({ 
        where: { sellerId: req.params.id },
        include: [{
          model: Seller,
          attributes: ['name'] 
        }]
      });
      return sendResponse(res, 200, true, 'Activities fetched successfully', activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }

const getAllActivities=async(req,res)=>{
    try{
        const activities=await Activity.findAll({
            include:[{
                model:Seller,
                attributes:['name']
            }],
            order:[['createdAt','DESC']],
            limit:10
        });
        sendResponse(res,200,true,'Activities fetched successfully',activities);
    }
    catch(err){
        console.error('Error fetching activities:',err);
        sendResponse(res,500,false,err.message);
    }
}
  
    module.exports = {
        trackActivity,
        getActivitiesForSeller,
        getAllActivities
    };  