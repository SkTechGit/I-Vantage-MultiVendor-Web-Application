import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import env from "../src/config/env.config.js";
import Auth from "../src/modules/auth/auth.model.js";

// Ensure DNS resolution for MongoDB Atlas SRV connection on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const createOrUpdateAdmin = async () => {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "sandeep.assetsense@gmail.com";
  const password = args[1] || process.env.ADMIN_PASSWORD;
  const fullName = args[2] || "Sandeep";

  if (!email) {
    console.error("❌ Email is required. Usage: node scripts/create-admin.js <email> <password> [fullName]");
    process.exit(1);
  }

  if (!password) {
    console.error("❌ Password is required (min 8 chars). Usage: node scripts/create-admin.js <email> <password> [fullName]");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB.");

    let user = await Auth.findOne({ email: email.toLowerCase() });

    if (user) {
      console.log(`Admin user with email "${email}" already exists. Updating password...`);
      user.password = password;
      user.fullName = fullName || user.fullName;
      user.isActive = true;
      await user.save();
      console.log(`✅ Admin user "${email}" updated successfully!`);
    } else {
      console.log(`Creating new admin user "${email}"...`);
      user = new Auth({
        fullName,
        email: email.toLowerCase(),
        password,
        isActive: true,
      });
      await user.save();
      console.log(`✅ Admin user "${email}" created successfully!`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating/updating admin:", err);
    process.exit(1);
  }
};

createOrUpdateAdmin();
