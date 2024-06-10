import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        length:8,
        required:true
    },
    secret_key:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        default:0
    },
    mob_no:{
        type:String,
        default:"0"
    },
    address:{
        type:String,
    }


},{timestamps:true});
export default mongoose.model('users',userSchema)