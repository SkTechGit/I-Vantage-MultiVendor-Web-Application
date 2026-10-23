import mongoose from "mongoose";
import { ENQUIRY_STATUS, CONSULTATION_MODE } from "./professionals.constants.js";

const enquiryEventSchema = new mongoose.Schema(
  {
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalEnquiry",
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    type: {
      type: String,
      enum: ["STATUS_CHANGED", "NOTE", "ASSIGNED", "NOTIFIED"],
      required: true,
    },
    fromStatus: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: null,
    },
    toStatus: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: null,
    },
    body: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const ProfessionalEnquiryEvent =
  mongoose.models.ProfessionalEnquiryEvent ||
  mongoose.model("ProfessionalEnquiryEvent", enquiryEventSchema);

const professionalEnquirySchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mode: {
      type: String,
      enum: Object.values(CONSULTATION_MODE),
      default: CONSULTATION_MODE.ONLINE,
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.NEW,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    sourcePath: {
      type: String,
      default: "",
    },
    consentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    consentVersion: {
      type: String,
      default: "1.0",
    },
    ipHash: {
      type: String,
      default: null,
    },
    firstResponseAt: {
      type: Date,
      default: null,
    },
    anonymisedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

professionalEnquirySchema.index({ professionalId: 1, status: 1, createdAt: -1 });
professionalEnquirySchema.index({ phone: 1, professionalId: 1, createdAt: -1 });

const ProfessionalEnquiry =
  mongoose.models.ProfessionalEnquiry ||
  mongoose.model("ProfessionalEnquiry", professionalEnquirySchema);

export default ProfessionalEnquiry;
