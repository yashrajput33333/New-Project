import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
? process.env.CORS_ORIGIN.split(",")
: ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

app.get('/',(req,res)=>{
    res . send ( {
    activeStatus : true,
    error:false,
    })    
})

export {app}