const userModel=require('../model/model.js')
async function registerUser(req,res) { 
    const {fullName,phoneNo,password}=req.body
    const isUserAlreadyExists=await userModel.findOne({password})
    
    if(isUserAlreadyExists){
        return  res.status(400).json({message:"user already exists  "})
    }
    const user=await userModel.create({fullName,phoneNo,password})
    res.status(201).json({message:"user registerd successfully",
        user:{
            _id:user._id,
            phoneNo:user.phoneNo,
            fullName:user.fullName
        }
    })
}

async function loginUser(req,res) {
    const {fullName,password}=req.body
    const user=await userModel.findOne({password})

    if(!user||user.password !== password){
        return res.status(400).json({message:"invalid user or password"})
    }
     res.status(200).json({
        message:"user logged is successfully",
        user:{
            _id:user._id,
            fullName:user.fullName
        }
     })
}


module.exports={registerUser,loginUser}