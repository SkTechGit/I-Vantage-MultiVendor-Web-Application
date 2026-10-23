import mongoose from "mongoose";

const professionalAuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      default: "guest",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    diff: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipHash: {
      type: String,
      default: null,
    },
    requestId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

professionalAuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const ProfessionalAuditLog =
  mongoose.models.ProfessionalAuditLog ||
  mongoose.model("ProfessionalAuditLog", professionalAuditLogSchema);

const professionalDailyStatSchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
      index: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    callClicks: {
      type: Number,
      default: 0,
    },
    whatsappClicks: {
      type: Number,
      default: 0,
    },
    enquiries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

professionalDailyStatSchema.index({ professionalId: 1, date: 1 }, { unique: true });

export const ProfessionalDailyStat =
  mongoose.models.ProfessionalDailyStat ||
  mongoose.model("ProfessionalDailyStat", professionalDailyStatSchema);
