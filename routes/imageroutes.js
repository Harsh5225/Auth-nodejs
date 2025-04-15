import express from "express";
import isAuthenticate from "../middlewares/auth-middleware.js";
import isAdminUser from "../middlewares/admin-middleware.js";
import { uploadMiddleware } from "../middlewares/upload-middleware.js";

import {uploadImage,fetchuploadeImage, deleteImage,uploadImageswithForm} from "../controllers/imageControllers.js";

const router=express.Router();


// upload the image
router.get('/fetch',isAuthenticate,fetchuploadeImage);

router.post('/upload',isAuthenticate,isAdminUser,uploadMiddleware.single('image'),uploadImage)

router.delete('/:id',isAuthenticate,isAdminUser,deleteImage)


router.post('/uploadimage',uploadMiddleware.single('image'),uploadImageswithForm)



export default router;