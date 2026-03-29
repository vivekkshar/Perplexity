import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import connecttodb from "./config/database.js"
import chatRouter from "./routes/chat.routes.js"
import router from "./routes/auth.routes.js"
import morgan from "morgan"
import cors from "cors"



const app = express()

// connect to database

connecttodb()


// middleware

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))



// api router 
app.use("/api/auth", router )
app.use("/api/chats", chatRouter)



export default app