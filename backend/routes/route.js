const express =require("express")
const router=express.Router()
router.use(express.json())

const {loginUser,registerUser}=require('../controller/controller.js')

router.post('/user/register',registerUser)

router.post('/user/login',loginUser)


module.exports={router}