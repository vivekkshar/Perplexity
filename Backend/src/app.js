import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import connecttodb from "./config/database.js"
import router from "./routes/auth.routes.js"



const app = express()

// connect to database

connecttodb()

// middleware

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))




app.use("/api/auth", router )



export default app