import mongoose from "mongoose";

const imageSchema=new mongoose.Schema({
url:{
  type:String,
  required:true
},
publicId:{
  type:String,
  required:true
},

//  ⭐
uploadedBy:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"user",
  required:true
}
},{timestamps:true})


export const Image=mongoose.model("Image",imageSchema);