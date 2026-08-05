import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Auth from "../modules/auth/auth.model.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const exists = await Auth.findOne({
      email: "rj7075yadav@gmail.com",
    });

    if (exists) {
      console.log("Admin already exists.");
      process.exit();
    }

    await Auth.create({
      fullName: "Administrator",
      email: "rj7075yadav@gmail.com",
      password: "Admin@123",
    });

    console.log("Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();