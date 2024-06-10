import express, { Router } from "express";
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
import { braintreeController, createProduct, deleteProduct, getCategoryProduct, getProduct, getProductPhoto, getallProduct, paymentController, productCount, productFilter, productSearch, productlistControl, updateProduct } from "../Controller/productControl.js";
import ExpressFormidable from "express-formidable";
const router=express.Router()

router.post("/create-product",requireSignin,isAdmin,ExpressFormidable(),createProduct)

router.get("/get-allproduct",getallProduct)

router.get("/get-product/:slug",getProduct)

router.get("/get-product-photo/:pid",getProductPhoto)

router.put("/update-product/:pid",requireSignin,isAdmin,ExpressFormidable(),updateProduct)

router.delete("/delete-product/:pid",requireSignin,isAdmin,deleteProduct)

router.post('/product-filters',productFilter)

router.get('/product-count',productCount)

router.get('/product-list/:page',productlistControl)

router.get('/search/:keyword',productSearch)

router.get('/category-product/:slug',getCategoryProduct)

router.get('/braintree/token',braintreeController)

router.post('/braintree/payment',requireSignin,paymentController)



export default router

