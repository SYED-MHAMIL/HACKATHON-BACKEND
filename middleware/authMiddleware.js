
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendRes from "../helper/sendResponse.js";
import User from "../model/authModel.js";
export default async function authMiddleware(req,res,next){
 try {
  dotenv.config()
  console.log("req.header=>>>> " , req?.headers?.authorization)
  let bearerwithtoken=req?.headers?.authorization ;
  if(!bearerwithtoken) return sendRes(res,404,"token not provided ",true,null)
let token  =bearerwithtoken.split(" ")[1];
console.log("token=>>>>>>>>>>",token);

let  decoded= jwt.verify(token,process.env.API_SECRET)
if(decoded){  
 const user= await User.findById(decoded._id)
 if(user){
     req.user=user
     next()                      
 }else{
return  sendRes(res,404,"user not found",true,null)
 }
}else{
return  sendRes(res,404,"invalid token",true,null)
      
} 
 } catch (error) {
  return  sendRes(res,404,"invalid token",true,null)

 }           
}

