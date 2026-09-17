import mongoose from "mongoose";
import env from "./env.config.js";
import dns from "dns";

dns.setServers(["8.8.8.8"]);


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