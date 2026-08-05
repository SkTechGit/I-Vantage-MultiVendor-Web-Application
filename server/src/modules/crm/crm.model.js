import mongoose from "mongoose";

import {
  CRM_STAGE,
  CRM_PRIORITY,
} from "./crm.constants.js";

const crmSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
    },

    stage: {
      type: String,
      enum: Object.values(CRM_STAGE),
      default: CRM_STAGE.ACTIVE,
    },

    priority: {
      type: String,
      enum: Object.values(CRM_PRIORITY),
      default: CRM_PRIORITY.MEDIUM,
    },

    expectedValue: {
      type: Number,
      default: 0,
    },

    expectedClosingDate: Date,

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CRM",
  crmSchema
);