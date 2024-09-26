const jwt = require ('jsonwebtoken')
const verifyToken = (req,res,next) => {
    const token = req.cookies.accessToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,user) =>{
            if(err){
                res.status(500).json({message:"ACCESS DENIED"})
            }else{
                req.user =user
                next();
            }
        })
    }else{
        res.status(401).json({message:"Access Denieds"})
    }
};
module.exports = verifyToken   