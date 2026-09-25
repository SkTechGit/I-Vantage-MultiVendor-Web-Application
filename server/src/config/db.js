import mongoose from "mongoose";
import dns from "dns";
import env from "./env.config.js";

// Ensure DNS resolution succeeds for SRV MongoDB connection strings across local routers / ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // fallback silently if custom DNS cannot be set
}

function getEffectiveUri(uri) {
  if (!uri || !uri.startsWith("mongodb+srv://")) return uri;
  if (uri.includes("virtualoffice.sssb12s.mongodb.net")) {
    const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@virtualoffice\.sssb12s\.mongodb\.net\/(.*)$/);
    if (match) {
      const [, user, pass, rest] = match;
      const db = rest.split("?")[0] || "i-vantage";
      return `mongodb://${user}:${pass}@ac-4ypyhvm-shard-00-00.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-01.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-02.sssb12s.mongodb.net:27017/${db}?ssl=true&authSource=admin&replicaSet=atlas-on4dtu-shard-0`;
    }
  }
  return uri;
}

const connectDB = async () => {
  try {
    const rawUri = env.mongoUri;
    // Prefer SRV connection if available, fallback gracefully
    try {
      await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 8000 });
      console.log("MongoDB connected successfully");
      return;
    } catch (firstErr) {
      const altUri = getEffectiveUri(rawUri);
      if (altUri !== rawUri) {
        await mongoose.connect(altUri, { serverSelectionTimeoutMS: 10000 });
        console.log("MongoDB connected successfully via fallback URI");
        return;
      }
      throw firstErr;
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message || err);
  }
};

export default connectDB;