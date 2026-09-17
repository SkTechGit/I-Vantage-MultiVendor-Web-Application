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
      console.log(`Email: ${email}`);
      console.log(`Role: ${exists.role}`);
      console.log(`Status: ${exists.status}`);

      await process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Auth.create({
      fullName: "Administrator",
      email,
      password: hashedPassword,
      role: "super_admin",
      status: "active",
      isActive: true,
      approvedAt: new Date(),
    });

    console.log("Admin created successfully.");
    console.log(`Email: ${email}`);

    await process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
};

createAdmin();