import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.js"
import Homeroutes from "./routes/Homeroutes.js"
import Adminroutes from "./routes/Adminroutes.js"
import uploadImageRouter from "./routes/imageroutes.js"
const app=express();

dotenv.config();
connectDB();
// middleware for parsing
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const PORT=process.env.PORT || 3000;
// 
app.use('/app/auth',userRoutes)
app.use('/app/home',Homeroutes)
app.use('/app/admin',Adminroutes)
app.use('/app/image',uploadImageRouter)
app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
});

