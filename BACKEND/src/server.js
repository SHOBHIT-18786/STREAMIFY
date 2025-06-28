import "dotenv/config";
import express from "express";
import authroutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import userroutes from "./routes/user.route.js";
import chatroutes from "./routes/chat.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authroutes);
app.use("/api/users",userroutes)
app.use("api/chat",chatroutes);

app.listen(PORT,()=>{
    console.log("Server is running on port 5001");
    connectDB();
});