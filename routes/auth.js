
import express from "express"  
import Joi from "joi"
import User from "../model/authModel.js"
import dotenv from "dotenv"
import  bcrypt from "bcryptjs"
import nodemailer from 'nodemailer'
import sendRes from "../helper/sendResponse.js"
import jwt from "jsonwebtoken"
const router = express.Router()
 dotenv.config()



// user ki email
const { senderEmail, senderPassword } = process.env;

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

function verifyEmail(email, token) {
  const mailOptions = {
    from: senderEmail,
    to: email,
    html: `<p>Please verify your email and click on the link </p> 
 <a href="http://localhost:3000/verify-email?token=${token}">Click Here</a>
 `,
    subject: "Verification Email",
  };

  transporter.sendMail(mailOptions, (error, sucesss) => {
    if (error)  return error
    if(sucesss)   return console.log("successs");
    
    console.log("emailMessage======>>>>>>>>", "suceesfull");
  });
}



const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    // fullname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role:  Joi.string().valid('admin', 'receptionist', 'department').required()

})
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})


router.post("/register",async(req,res)=>{
  const    {error,value } =registerSchema.validate(req.body)
 if(error) return   sendRes(res,404,error?.message,true , null)
      
        const  userFound=await  User.findOne({email : value.email})
           if(userFound) return sendRes(res,404,"user already register",true,null)
            let newUser=new User(value)
           const hashcode=await bcrypt.hash(newUser.password ,10)

          newUser.password =hashcode
    await  newUser.save()
     const userObj = newUser.toObject();
      
     delete userObj.password;
     
            const token = jwt.sign({...userObj},process.env.API_SECRET)
            verifyEmail(newUser.email, token)
    if(userObj) return sendRes(res,200,"user register please verify your email",false,{token,userObj})
        

})
   
router.post("/login",async(req,res)=>{
      const {error,value}=loginSchema.validate(req.body)    
      if(error) return   sendRes(res,404,error?.message,true , null)
        const  userFound=await  User.findOne({email : value.email}).lean() 
    if(!userFound) return  sendRes(res,404,"user not register please resgister",true , null)
    const checkPassword=await bcrypt.compare(value.password , userFound.password)
    if(!checkPassword) return  sendRes(res,404,"in valid password",true , null)
            delete  userFound.password
            const token = jwt.sign({...userFound},process.env.API_SECRET)
        if(userFound) return  sendRes(res,200,"you are succesfully login",true ,{ userFound,token

        })
    


})

router.post("/verify-email" ,async (req, res) => {
    const { token } = req.body;
    console.log(token);
    
    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }
    let  decoded= jwt.verify(token,process.env.API_SECRET)
   
   let user= await User.findByIdAndUpdate(decoded._id,{emailVerified:true})
  
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
  
    res.status(200).json({ message: "Email verified successfully!" ,user});
  });
  



export default router