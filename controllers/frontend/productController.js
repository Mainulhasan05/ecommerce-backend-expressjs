const Product=require('../../models/common/productModel');
const ProductImage=require('../../models/common/product_helpers/productImagesModel');
const Category=require('../../models/common/categoryModel');
const sendResponse=require('../../utils/sendResponse');
const deleteImage=require('../../utils/deleteImage');


const getAllProducts=async(req,res)=>{
    try{
        const products=await Product.findAll({
            attributes:['id','name','slug','image','old_price','new_price','quantity','status'],
            include:[
                {
                    model:ProductImage,
                    attributes:['url'],
                    as:'images'
                }
            ]
        });

        sendResponse(res,200,true,'Products fetched successfully',products);
    }catch(error){
        console.error(error);
        sendResponse(res,500,false,error.message);
    }
};

// get product by slug
const getProductBySlug=async(req,res)=>{
    // get product with images, and categories, also increase the view count
    try{
        const slug=req.params.slug;
        const product=await Product.findOne({
            where:{
                slug
            },
            include:[
                {
                    model:ProductImage,
                    attributes:['url'],
                    as:'images'
                },
                {
                    model:Category,
                    attributes:['name','slug'],
                    as:'categories'
                }
            ]
        });

        if(!product){
            return sendResponse(res,404,false,'Product not found');
        }

        product.views=product.views+1;
        
        await product.save();

        sendResponse(res,200,true,'Product fetched successfully',product);
    }
    catch(error){
        console.error(error);
        sendResponse(res,500,false,error.message);
    }
}

module.exports={
    getAllProducts,
    getProductBySlug
}