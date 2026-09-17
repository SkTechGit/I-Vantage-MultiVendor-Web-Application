import mongoose from "mongoose";
import dns from "dns";
import env from "./env.config.js";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

// Ensure DNS resolution succeeds for SRV MongoDB connection strings across local routers / ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // fallback silently if custom DNS cannot be set
}

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectDB;