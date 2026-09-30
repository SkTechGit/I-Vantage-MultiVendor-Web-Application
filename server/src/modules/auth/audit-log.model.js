import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "admin_invited",
        "admin_signup_request",
        "admin_invitation_accepted",
        "admin_approved",
        "admin_rejected",
        "admin_suspended",
        "admin_login",
        "vendor_login",
        "user_login",
        "vendor_signup",
        "vendor_registered",
        "user_signup",
        "member_role_changed",
        "member_status_toggled",
        "admin_status_toggled",
        "token_refreshed",
        "member_deleted",
        "listing_created",
        "listing_updated",
        "listing_submitted_for_review",
        "listing_approved",
        "listing_rejected",
        "listing_live_toggled",
        "listing_deleted",
      ],
      index: true,
    },

    portal: {
      type: String,
      enum: ["admin_portal", "vendor_portal", "customer_portal", "system"],
      default: "system",
      index: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    targetEmail: {
      type: String,
      default: null,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
