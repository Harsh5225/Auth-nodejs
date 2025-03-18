import express from 'express';
import isAuthenticate from '../middlewares/auth-middleware.js';


const router=express.Router();


router.get('/welcome',isAuthenticate,(req,res)=>{
  const {username,userID,role}=req.userInfo;
    res.status(200).json({
      user:{
        username,
        userID,
        role
      },
    message:"wlcm to Home page"
  })
})



export default router;
