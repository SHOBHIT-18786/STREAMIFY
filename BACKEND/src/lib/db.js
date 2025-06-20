import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_CS);
        console.log("Database Connected:");
    }
    catch(error){
        console.log("Error connecting to database",error);
        process.exit(1);
    }
};