import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const authSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: null },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["super_admin", "vendor", "user", "professional"], default: "user" },
    status: { type: String, enum: ["pending", "active", "rejected", "suspended"], default: "active" },
    tokenVersion: { type: Number, default: 0 },
    approvedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const isAlreadyBcrypt = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password);
  if (!isAlreadyBcrypt) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);

const demoAccounts = [
  {
    slug: "rahul-sharma-ca",
    fullName: "Rahul Sharma",
    email: "ca.rahul@ivantage.in",
    phone: "+919811002233",
    password: "Password@123",
  },
  {
    slug: "ananya-iyer-ca",
    fullName: "Ananya Iyer",
    email: "ananya.ca@ivantage.in",
    phone: "+919822113344",
    password: "Password@123",
  },
  {
    slug: "karan-malhotra-gst-consultant",
    fullName: "Karan Malhotra",
    email: "karan.tax@ivantage.in",
    phone: "+919833224455",
    password: "Password@123",
  },
  {
    slug: "advocate-priya-mehta",
    fullName: "Priya Mehta",
    email: "adv.priya@ivantage.in",
    phone: "+919844335566",
    password: "Password@123",
  },
];

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const professionalCollection = mongoose.connection.collection("professionalprofiles");

    for (const acc of demoAccounts) {
      const normalizedEmail = acc.email.toLowerCase().trim();
      let authUser = await Auth.findOne({ email: normalizedEmail });

      if (!authUser) {
        const hashedPassword = await bcrypt.hash(acc.password, 12);
        authUser = await Auth.create({
          fullName: acc.fullName,
          email: normalizedEmail,
          phone: acc.phone,
          password: hashedPassword,
          role: "professional",
          status: "active",
          isActive: true,
          approvedAt: new Date(),
        });
        console.log(`Created Auth user: ${authUser.email} (_id: ${authUser._id})`);
      } else {
        authUser.role = "professional";
        authUser.status = "active";
        authUser.isActive = true;
        const hashedPassword = await bcrypt.hash(acc.password, 12);
        authUser.password = hashedPassword;
        await authUser.save();
        console.log(`Updated Auth user: ${authUser.email} (_id: ${authUser._id})`);
      }

      // Link to ProfessionalProfile
      const updateResult = await professionalCollection.updateOne(
        { slug: acc.slug },
        {
          $set: {
            userId: authUser._id,
            contactEmail: authUser.email,
          },
        }
      );
      console.log(`Linked profile ${acc.slug} -> matched: ${updateResult.matchedCount}, modified: ${updateResult.modifiedCount}`);
    }

    console.log("\n========================================================");
    console.log("DEMO PROFESSIONAL LOGIN CREDENTIALS:");
    console.log("========================================================");
    demoAccounts.forEach((acc) => {
      console.log(`Professional: ${acc.fullName} (${acc.slug})`);
      console.log(`Email:        ${acc.email}`);
      console.log(`Password:     ${acc.password}`);
      console.log(`Login URL:    http://localhost:3000/professional/login`);
      console.log("--------------------------------------------------------");
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Execution error:", err);
    process.exit(1);
  }
}

run();
