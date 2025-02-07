import mongoose  from "mongoose";
const {Schema}  = mongoose
 const authshcema=new Schema({
       name : String ,
       fullname :  String ,
       email : String ,
       password : String,
       emailVerified: { type: Boolean , default: false }  ,
       role: { type: String, enum: ['admin', 'receptionist', 'department'], required: true }                
 })

 const  User=mongoose.model("Userpractise" , authshcema)
export default User