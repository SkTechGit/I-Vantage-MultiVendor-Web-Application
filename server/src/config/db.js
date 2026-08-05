import mongoose from "mongoose";
import env from "./env.config.js";


const connectDB= async ()=>{
    try{
          await mongoose.connect(env.mongoUri);
          console.log("MongoDB connected successfully");
    }
    catch(err){
        console.error("Error connecting to MongoDB:", err);
    }
}

export default connectDB;