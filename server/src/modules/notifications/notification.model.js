import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["lead", "vendor", "listing", "security", "system"],
      default: "system",
      index: true,
    },
    priority: {
      type: String,
      enum: ["high", "normal", "low"],
      default: "normal",
    },
    actionUrl: {
      type: String,
      default: "/admin/dashboard",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema, "admin_notifications");

export default Notification;
