import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
  name:{
    type:String,
    required:true
  }, 
  description:{
    type:String,
    required:true
  },
  slug:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    requied:true
  },
  category:{
    type:mongoose.ObjectId,
    ref:"Category",
    required:true
  },
  quantity:{
    type:Number,
    required:true,
  },
  shipment:{
    type:Boolean,
  },
  image:{
    data:Buffer,
    contentType:String
  },
 }, 
{timestamps:true}
)

export default mongoose.model("Products",productSchema)