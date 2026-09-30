import mongoose from "mongoose";

const adminInvitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "vendor", "user"],
      default: "vendor",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "revoked", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if invitation is still valid
adminInvitationSchema.methods.isValid = function () {
  return (
    this.status === "pending" &&
    !this.acceptedAt &&
    new Date() < new Date(this.expiresAt)
  );
};

const AdminInvitation = mongoose.model(
  "AdminInvitation",
  adminInvitationSchema
);

export default AdminInvitation;
