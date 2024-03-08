const jwt=require('jsonwebtoken');

const verifySellerToken=(req,res,next)=>{
    const token=req.header('authorization').split(' ')[1];
    console.log(token)
    if(!token) return res.status(401).send('Access Denied');
    try{
        console.log(process.env.JWT_SECRET);
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.id=verified.id;
        
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports=verifySellerToken;