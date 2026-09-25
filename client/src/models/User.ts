import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: "superadmin" | "vendor" | "user" | "admin";
  businessName?: string;
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ["superadmin", "vendor", "user", "admin"],
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
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.MarketplaceUser ||
  mongoose.model<IUserDocument>("MarketplaceUser", userSchema, "marketplace_users");

export default User;
