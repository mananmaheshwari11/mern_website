 import { comparePassword, hashPassword } from "../helper/authHelp.js";
import orderModule from "../modules/orderModule.js";
import userModule from "../modules/userModule.js";
import jwt from 'jsonwebtoken';
 export const registerControl =async(req,res)=>{
    try{
        const {name,email,password,secret_key}=req.body
        if(!name){
            return res.send({message:'Name is required'})
        }
        if(!email){
            return res.send({message:'E-mail is required'})
        }
        if(!password && password.length<8){
            return res.send({message:'Password must be 8 character long'})
        }
        if(!secret_key){
            return res.send({message:'Secret_key is required'})
        }
        const existingUser =await userModule.findOne({email})

        if(existingUser){
            return res.status(200).send({
                success: false,
                message:'already registered please login'
            })
        }
        const hashedpassword = await hashPassword(password)
        const user = await new userModule({name,email,password:hashedpassword,secret_key}).save();

        res.status(201).send({
            success:true,
            message:'User Registered successfully',
            user
        })
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
};

//POST LOGIN
export const loginController=async(req,res)=>{
        try{
            const{email,password}=req.body
            //validation
            if(!email|| !password){
                return res.status(404).send({
                    success:false,
                    message:"invalid email or password"
                })
        }
        const user=await userModule.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(404).send({
                success:false,
                message:"Invalid password"
            })
        }
        //token 
        const token =await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                name:user.name,
                email:user.email,
                mob_no:user.mob_no,
                address:user.address,
                role:user.role,
                secret_key:user.secret_key
            },
            token
        })
    }       
        catch(error){
            res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
}
};

//testControl


export const forgotpasswordController= async (req,res)=>{
    try{
        const{email,secret_key,newPassword}=req.body
        if(!email){
            res.status(404).send({message:"E-mail is required"})
        }
        if(!secret_key){
            res.status(404).send({message:"Answer is required"})
        }
        if(!newPassword){
            res.status(404).send({message:"New Password is required"})
        }
        const user=await userModule.findOne({email,secret_key});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found",
            });
        }
        const hashed=await hashPassword(newPassword)
        await userModule.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            message:"Password update successfully",
            success:true
        })

    }
    catch(error){
        res.status(500).send({
        message:"something went wrong",
        success:false    
        })
    }
}
export const userdetailController=async(req,res)=>{
    try{
        const{email,mob_no,address}=req.body
        if(!mob_no || isNaN(mob_no)){
            res.status(404).send({message:"Mobile number is not found"})
        }
        if(!address){
            res.status(404).send({message:"Address is not found"})
        }
        const user=await userModule.findOne({email})
        await userModule.findByIdAndUpdate(user._id,{mob_no,address})
        res.status(200).send({
            message:"Additional Information Updated",
            success:true
        })
    }
    catch(error){
        res.status(404).send({
        message: "Fail to save details",
        success:false,
        })
    }
}

export const updateProfileControl=async(req,res)=>{
    try {
        const{name,email,password,secret_key}=req.body
        const user=await userModule.findById(req.user._id)

        if(password && password.length<8){
            return res.send({message:'Password must be 8 character long'})
        }
        const hashedpassword=password? await hashPassword(password): undefined
        const updatedUser=await userModule.findByIdAndUpdate(req.user._id,{
            name:name|| user.name,
            secret_key:secret_key|| user.secret_key,
            password: hashedpassword || user.password},
            {new:true})
        res.status(200).send({
            success:true,
            message:"User Profile Updated",
            updatedUser
        })
        
    } catch (error) {
        res.status(404).send({
            success:false,
            message:"Profile not updated",
            error
        })
    }
}

export const getOrderControl=async(req,res)=>{
    try {
        const orders=await orderModule.find({buyer:req.user._id}).populate("products").populate("buyer","name")
        res.json(orders)
    } 
    catch (error) {
        res.status(404).send({
            success:false,
            message:"Error in Orders",
            error
        })
    }
}

export const getAllordersControl=async(req,res)=>{
    try{
        const orders=await orderModule.find({}).populate("products").populate("buyer","name").sort({"createdAt":-1})
        res.json(orders)
    }
    catch(error){
        res.status(404).send({
            success:false,
            message:"error in getting admin order",
            error
        })
    }
}

export const getOrderStatus=async(req,res)=>{
    try {
        const{orderId}=req.params
        const{status}=req.body
        const orders=await orderModule.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    } catch (error) {
        res.status(404).send({
            success:false,
            message:"error in getting order status",
            error
        })
    }
}