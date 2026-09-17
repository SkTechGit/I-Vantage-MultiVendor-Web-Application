import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const authSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: "super_admin" },
  status: { type: String, default: "active" },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  approvedAt: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

const Auth = mongoose.model("Auth", authSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "sandeep.assetsense@gmail.com";
    const password = "Admin@assetsense9958";

    // Check if admin already exists
    const existing = await Auth.findOne({ email });
    if (existing) {
      console.log(`Admin user already exists: ${email}`);
      console.log(`  Role: ${existing.role}, Status: ${existing.status}`);
      
      // Make sure the account is active
      if (existing.status !== "active" || existing.role === "pending") {
        existing.status = "active";
        existing.role = "super_admin";
        existing.isActive = true;
        await existing.save();
        console.log("  -> Updated to active super_admin");
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      await Auth.create({
        fullName: "Admin",
        email,
        password: hashedPassword,
        role: "super_admin",
        status: "active",
        isActive: true,
        approvedAt: new Date(),
      });
      console.log(`Admin user created successfully!`);
    }

    console.log(`\n  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`\n  Login at: http://localhost:3000/admin/login`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedAdmin();
