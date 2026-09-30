import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ["superadmin", "vendor", "user"],
      default: "vendor",
      required: true,
    },
    businessName: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
      trim: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    registeredVia: {
      type: String,
      default: "vendor_portal",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (this.isModified("passwordHash") && !this.isNew) {
    this.tokenVersion = (this.tokenVersion || 0) + 1;
  }
});

const User =
  mongoose.models.MarketplaceUser ||
  mongoose.model("MarketplaceUser", userSchema, "marketplace_users");

export default User;
