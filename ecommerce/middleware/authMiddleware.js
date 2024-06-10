import jwt from 'jsonwebtoken'
import userModule from '../modules/userModule.js';

export const requireSignin=async(req,res,next)=>{
    const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
    req.user= decode;
    next();
}

//admin access
export const isAdmin = async (req,res,next)=>{
    try{
        const user= await userModule.findById(req.user._id)
        if(user.role !== 1){
            return res.status(404).send({
                success: false,
                message:"Unauthorized access",
            });
        }
        else{
            next();
        }
    }
    catch(error){
        console.log("Error 404")
        
    }
}