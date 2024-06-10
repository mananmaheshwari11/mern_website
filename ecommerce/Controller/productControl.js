import slugify from "slugify"
import productModule from "../modules/productModule.js"
import categoryModule from "../modules/ctgModule.js"
import fs from 'fs'
import dotenv from 'dotenv'
import braintree from "braintree"
import { configDotenv } from "dotenv"
import orderModule from "../modules/orderModule.js"
dotenv.config()
// gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
  });
  




export const createProduct=async(req,res)=>{
    try{
        const {name,description,slug,price,category,quantity,shipment,}=req.fields
        const {image}=req.files    
        if(!name){
            return res.status(404).send({message:"Name is required"})
        }
        if(!description){
            return res.status(404).send({message:"Description is required"})
        }
        if(!price){
            return res.status(404).send({message:"Price is required"})
        }
        if(!category){
            return res.status(404).send({message:"Category is required"})
        }
        if(!quantity){
            return res.status(404).send({message:"Quantity is required"})
        }
        if(image && image.size>10000000){
            return res.status(404).send({message:"Required photo should be less than 2mb"})
        }
        const products=new productModule({...req.fields,slug:slugify(name)})
        if(image){
            products.image.data=fs.readFileSync(image.path)
            products.image.contentType=image.type
        }
            await products.save()
            res.status(200).send({
                message:"Product saved Successfully",
                success:true,
                products
            })
    }
    catch(error){
        console.log(error)
        return res.status(404).send({
            success:false,
            message:"Error in product creation",
            error
        })
}
}

export const getallProduct=async(req,res)=>{
    try{
        const products=await productModule.find({}).select("-image").populate('category').limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:"Product List",
            cnt:products.length,
            products
        })
    }
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"Error in products list extraction",
            error
        })
}
}
export const getProduct=async(req,res)=>{
    try{
        const product=await productModule.find({slug:req.params.slug}).populate('category').select("-image")
        res.status(200).send({
            success:true,
            message:"Product List",
            product
        })
    }
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"Error in product search",
            error
        })
}
}
export const getProductPhoto=async(req,res)=>{
    try{
        const product=await productModule.findById(req.params.pid).select('image')
        if(product.image.data){
            res.set('Content-type',product.image.contentType)
        res.status(200).send(
            product.image.data
        )
    }
}
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"Error in photo fetch",
            error
        })
}}

export const deleteProduct=async(req,res)=>{
    try{
        await productModule.findByIdAndDelete(req.params.pid)
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"
        })
    }
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"Error in deleting product",
            error
        })
}

}

export const updateProduct=async(req,res)=>{
    try{
        const {name,description,slug,price,category,quantity,shipment,}=req.fields
        const {image}=req.files    
        if(!name){
            return res.status(404).send({message:"Name is required"})
        }
        if(!description){
            return res.status(404).send({message:"Description is required"})
        }
        if(!price){
            return res.status(404).send({message:"Price is required"})
        }
        if(!category){
            return res.status(404).send({message:"Category is required"})
        }
        if(!quantity){
            return res.status(404).send({message:"Quantity is required"})
        }
        if(image && image.size>10000000){
            return res.status(404).send({message:"Required photo should be less than 2mb"})
        }
        const products=await productModule.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(image){
            products.image.data=fs.readFileSync(image.path)
            products.image.contentType=image.type
        }
            await products.save()
            res.status(200).send({
                message:"Product updated Successfully",
                success:true,
                products
            })
    }
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"Error while updating product",
            error
        })
}
}

export const productFilter=async(req,res)=>{
    try{
        const {checked,radio}=req.body
        let args={}
        if(checked.length>0) args.category=checked
        if (radio.length) args.price={$gte:radio[0],$lte:radio[1]};
        const product=await productModule.find(args)
        res.status(200).send({
            success:true,
            message:"Applying Filter Successfully",
            product
        })
    }
    catch(error){
        console.log("Error 404")
        return res.status(404).send({
            success:false,
            message:"error"
    })
    }
}

export const productCount=async(req,res)=>{
    try{
        const total=await productModule.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    }
    catch(error){
        console.log("Error 404")
        res.status(404).send({
            success:false,
            error
        })
    }

}

export const productlistControl=async(req,res)=>{
    try{
        const card=9
        const page=req.params.page?req.params.page:1
        const products=await productModule.find({}).select(-'image').skip((page-1)*card).limit(card).sort({createdAt: -1});
        res.status(200).send({
            success:true,
            products
        })
    }
    catch(error){
        console.log("Error 404")
        res.status(404).send({
            success:false,
            error
        })
    }
}
export const productSearch=async(req,res)=>{
    try {
        const {keyword}=req.params
        const results=await productModule.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select("-image");
        res.json(results)
    } catch (error) {
        console.log("Error 404")
        res.status(404).send({
            success:false,
            error
        })
    }
}

export const getCategoryProduct=async(req,res)=>{
    try {
        const category=await categoryModule.findOne({slug:req.params.slug})
        const product=await productModule.find({category}).populate('category')
        res.status(200).send({
            success:true,
            message:"Fetched Products",
            product,
            category
        })
    } catch (error) {
        console.log("Error 404")
        res.status(404).send({
            success:false,
            message:"Error in getting the product",
            error
        })
        
    }
}


export const braintreeController=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(402).send(err);
            }
            else{
                res.send(response)
            }
        });

    } catch (error) {
        console.log("Error 404")
    }

}

export const paymentController= async(req,res)=>{
    try {
        const {nonce,optimizedCart,total}=req.body
        const newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(err,result){
            if(result){
                const order=new orderModule({
                    products: optimizedCart,
                    payment: result,
                    buyer: req.user._id
                }).save()
                res.json({ok:true})
                
            }
            else{
                res.status(402).send(err)
            
            }
        }
    )
    } catch (error) {
        console.log("Error 404")
    }
}