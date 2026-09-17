import connectDB from "../config/db.js";
import Auth from "../modules/auth/auth.model.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "sandeep.assetsense@gmail.com";
    const password = "Admin@assetsense9958";

    const exists = await Auth.findOne({ email });

    if (exists) {
      console.log("Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Auth.create({
      fullName: "Administrator",
      email: "sandeep.assetsense@gmail.com",
      password: "Admin@assetsense9958",
    });

    console.log("Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
};

createAdmin();