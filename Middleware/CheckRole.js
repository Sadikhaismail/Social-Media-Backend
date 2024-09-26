const checkRole = (roles) =>{
    return async (req,res,next) =>{
        if (roles.includes(req.user.role)){
            next();
        }else{
            res.status(401).json({message:"Access Denied"})
        }
    }
}
module.exports = checkRole