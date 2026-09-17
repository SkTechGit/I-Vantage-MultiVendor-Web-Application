import mongoose from "mongoose";

const blogAuditLogSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "published",
        "unpublished",
        "archived",
        "deleted",
      ],
      required: true,
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

const BlogAuditLog = mongoose.model("BlogAuditLog", blogAuditLogSchema);

export default BlogAuditLog;
