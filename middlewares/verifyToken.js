const jwt=require('jsonwebtoken');

const verifySellerToken=(req,res,next)=>{
    const token=req.header('auth-token');
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