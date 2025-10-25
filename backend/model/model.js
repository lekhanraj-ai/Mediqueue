//schema
const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        unique:true
    },
    password:{
        type:String ,
        unique:true,
        required:true
    }
}
)
module.exports=mongoose.model("userModel",userSchema)