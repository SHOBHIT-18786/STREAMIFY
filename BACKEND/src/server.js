import "dotenv/config";
import express from "express";
import authroutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authroutes);

app.listen(PORT,()=>{
    console.log("Server is running on port 5001");
    connectDB();
});