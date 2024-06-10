import slugify from "slugify"
import ctgModule from "../modules/ctgModule.js"

export const createCategorycontroller=async(req,res)=>{
        try{
            const{name}=req.body
            if(!name){
               return res.status(404).send({message:"Name is required"})
            }
            const existingCategory= await ctgModule.findOne({name})
            if(existingCategory){
                return res.status(200).send({
                    success:true,
                    message:"Category already exists",
                    existingCategory
                })
            }
            const category=await new ctgModule({
                name,
                slug: slugify(name),
            }).save()
            res.status(200).send({
                success:true,
                message:"new Category created",
                category
            })
        }
        catch(error){
                    console.log("Error 404")
            return res.status(404).send({
                success:false,
                message:"Error in creation",
                error
            })
        }
}


export const categoryupdateController=async(req,res)=>{
    try{
        const{name}=req.body
        const {id}=req.params
        const category=await ctgModule.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

        res.status(200).send({
            message:"Category Updated Successfully",
            success:true,
            category
        })
    }
    catch(error){
        res.status(404).send({
            message:"Error while updating category",
            success:false,
            error
        })
    }
}

export const allcategorycontroller=async(req,res)=>{
    try{
        const category=await ctgModule.find({})
        res.status(200).send({
            message:"Category List",
            success:true,
            category
        })
    }
    catch(error){
                console.log("Error 404")
        res.status(404).send({
            success:false,
            message:"Error in Category Extraction"
        })
    }

}

export const categorycontroller=async(req,res)=>{
    try{
        const category=await ctgModule.findOne({slug:req.params.slug})        
        res.status(200).send({
            message:"Category List",
            success:true,
            category
        })
    }
    catch(error){
                console.log("Error 404")
        res.status(404).send({
            success:false,
            message:"Error in Category Extraction"
        })
    }
}

export const deleteCategory=async(req,res)=>{
    try{
        const {id}=req.params
        await ctgModule.findByIdAndDelete(id)
        res.status(200).send({
            message:"Category Delete Successfully",
            success:true,
        })
    }

    catch(error){
                console.log("Error 404")

        res.status(404).send({
            success:false,
            message:"Error in Category Extraction"
        })
    }
}