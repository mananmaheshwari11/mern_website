import express from 'express'
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
import { allcategorycontroller, categorycontroller, categoryupdateController, createCategorycontroller, deleteCategory } from "../Controller/categoryControl.js";

const router=express.Router()

router.post('/create-category',requireSignin,isAdmin,createCategorycontroller)

router.put('/update-category/:id',requireSignin,isAdmin,categoryupdateController)

router.get("/get-all-category",allcategorycontroller)

router.get("/get-category/:slug",categorycontroller)

router.delete("/delete-category/:id",requireSignin,isAdmin,deleteCategory)
export default router