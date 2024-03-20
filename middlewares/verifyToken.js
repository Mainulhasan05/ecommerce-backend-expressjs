const jwt=require('jsonwebtoken');

const verifySellerToken=(req,res,next)=>{
    // check if it has token or it is not undefined

    if(!req.header('authorization')) return res.status(401).send('Access Denied');
    // if undefined then return 401
    if(req.header('authorization')===undefined) return res.status(401).send('Access Denied');
    const token=req.header('authorization').split(' ')[1];
    
    if(!token) return res.status(401).send('Access Denied');
    try{
        
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.id=verified.id;
        
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports=verifySellerToken;