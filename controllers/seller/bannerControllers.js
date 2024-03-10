const Banner=require('../../models/common/bannerModel');
const sendResponse = require('../../utils/sendResponse');

const addBanner=async(req,res)=>{
    const {imageUrl,type,sortValue,pageUrl}=req.body;
    const banner=await Banner.create({
        imageUrl,
        type,
        sortValue,
        pageUrl
    });
    return sendResponse(res, 201, true, 'Banner added successfully', banner);
}