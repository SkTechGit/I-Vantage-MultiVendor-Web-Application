import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Auth from "../modules/auth/auth.model.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const exists = await Auth.findOne({
      email: "sandeep.assetsense@gmail.com",
    });

    if (exists) {
      exists.role = "super_admin";
      exists.status = "active";
      exists.isActive = true;
      exists.approvedAt = new Date();
      await exists.save();
      console.log("Admin updated to active super_admin successfully.");
      process.exit();
    }

    await Auth.create({
      fullName: "Administrator",
      email: "sandeep.assetsense@gmail.com",
      password: "Admin@assetsense9958",
      role: "super_admin",
      status: "active",
      isActive: true,
      approvedAt: new Date(),
    });

    console.log("Admin created successfully with super_admin role.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();