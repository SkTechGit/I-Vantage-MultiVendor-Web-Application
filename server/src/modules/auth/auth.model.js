import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const authSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "vendor", "user", "pending"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended"],
      default: "pending",
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  // Bump tokenVersion on password change to invalidate all existing sessions
  if (!this.isNew) {
    this.tokenVersion = (this.tokenVersion || 0) + 1;
  }
});

authSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Auth = mongoose.model("Auth", authSchema);

export default Auth;