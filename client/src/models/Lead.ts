import mongoose, { Schema, Document, Model } from "mongoose";
import "./Listing";
import "./User";

export interface ILeadNote {
  authorId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface ILeadDocument extends Document {
  listingId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: "listing_enquiry" | "contact_form" | "callback_request";
  status: "new" | "contacted" | "converted" | "lost";
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceListing",
      index: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true },
    source: {
      type: String,
      enum: ["listing_enquiry", "contact_form", "callback_request"],
      default: "listing_enquiry",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
    },
    notes: [
      {
        authorId: {
          type: Schema.Types.ObjectId,
          ref: "MarketplaceUser",
          required: true,
        },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ vendorId: 1, status: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead: Model<ILeadDocument> =
  mongoose.models.MarketplaceLead ||
  mongoose.model<ILeadDocument>(
    "MarketplaceLead",
    leadSchema,
    "marketplace_leads"
  );

export default Lead;
