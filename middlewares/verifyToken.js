const jwt=require('jsonwebtoken');
const Seller=require('../models/seller/sellerModel');


const updateLastSeen = async (sellerId) => {
    try {
        await Seller.update({ last_seen: new Date() }, { where: { id: sellerId } });
    } catch (err) {
        console.error('Error updating last seen:', err);
    }
};
const verifySellerToken=(req,res,next)=>{

    if(!req.header('authorization')) return res.status(401).send('Access Denied');
    // if undefined then return 401
    if(req.header('authorization')===undefined) return res.status(401).send('Access Denied');
    const token=req.header('authorization').split(' ')[1];
    
    if(!token) return res.status(401).send('Access Denied');
    try{
        
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.id=verified.id;
        updateLastSeen(verified.id);

        
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports=verifySellerToken;