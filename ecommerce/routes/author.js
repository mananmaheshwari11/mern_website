import express from 'express'
import  {forgotpasswordController, registerControl, updateProfileControl, userdetailController, getOrderControl, getAllordersControl, getOrderStatus} from '../Controller/authControl.js'
import { loginController } from '../Controller/authControl.js'
import { requireSignin } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register',registerControl);

router.post('/login',loginController);

router.post('/forgotpassword',forgotpasswordController);

router.post('/userdetail',userdetailController)

router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true});
});

router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

router.put('/update-user',requireSignin,updateProfileControl);

router.get('/orders',requireSignin,getOrderControl)

router.get('/all-orders',requireSignin,isAdmin,getAllordersControl)

router.put('/order-status/:orderId',requireSignin,isAdmin,getOrderStatus)
export default router