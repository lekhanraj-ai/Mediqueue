const express = require("express")
const app = express()
const cors = require('cors')
const {router} = require('../routes/route.js')
const connectDB = require('../connect/connect.js')
require('dotenv').config()

const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json()) // This should come before routes
app.use('/api', router)



const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log("running")
        })
    } catch (error) {
        console.log(error)
    }
}

start()