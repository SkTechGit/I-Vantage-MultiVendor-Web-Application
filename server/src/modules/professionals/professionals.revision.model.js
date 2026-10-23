import mongoose from "mongoose";
import { REVISION_STATUS } from "./professionals.constants.js";

const profileRevisionSchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
      index: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REVISION_STATUS),
      default: REVISION_STATUS.PENDING,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

profileRevisionSchema.index({ professionalId: 1, status: 1 });

const ProfileRevision =
  mongoose.models.ProfileRevision ||
  mongoose.model("ProfileRevision", profileRevisionSchema);

export default ProfileRevision;
