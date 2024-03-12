const Banner=require('../../models/common/bannerModel');
const sendResponse = require('../../utils/sendResponse');
const deleteImage=require('../../utils/deleteImage');

const addBanner=async(req,res)=>{
    // {type: 'home', sortValue: '20', pageUrl: '/', buttonText: 'Shop More', status: 'active'}
    const {type,sortValue,pageUrl,buttonText,status}=req.body;
    const createdBy=req.id;
    try {
        let imageUrl='';
    if(req.file){
        imageUrl= `/${req.file.path}`
    }
    else{
        return sendResponse(res, 400, false, 'Image is required');
    }

    const banner=await Banner.create({
        imageUrl,
        type,
        sortValue,
        pageUrl,
        createdBy,
        status,
        buttonText
    });
    return sendResponse(res, 201, true, 'Banner added successfully', banner);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getBanners=async(req,res)=>{
    const banners=await Banner.findAll();
    return sendResponse(res, 200, true, 'Banners retrieved successfully', banners);
}

const getBanner=async(req,res)=>{
    const banner=await Banner.findByPk(req.params.id);
    if(!banner){
        return sendResponse(res, 404, false, 'Banner not found');
    }
    return sendResponse(res, 200, true, 'Banner retrieved successfully', banner);
}

const updateBanner=async(req,res)=>{
    const banner=await Banner.findByPk(req.params.id);
    if(!banner){
        return sendResponse(res, 404, false, 'Banner not found');
    }
    const {type,sortValue,pageUrl,buttonText,status}=req.body;
    let imageUrl=banner.imageUrl;
    if(req.file){
        // delete previous image
        if(banner.imageUrl){
            deleteImage(banner.imageUrl);
        }
        imageUrl= `/${req.file.path}`
    }
    await banner.update({
        imageUrl,
        type,
        sortValue,
        pageUrl,
        buttonText,
        status
    });
    return sendResponse(res, 200, true, 'Banner updated successfully', banner);
}

const deleteBanner=async(req,res)=>{
    const banner=await Banner.findByPk(req.params.id);
    if(!banner){
        return sendResponse(res, 404, false, 'Banner not found');
    }

    if(banner.imageUrl){
        deleteImage(banner.imageUrl);
    }
    await banner.destroy();
    return sendResponse(res, 200, true, 'Banner deleted successfully');
}

module.exports = {
  addBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner
};