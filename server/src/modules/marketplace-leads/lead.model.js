import mongoose from "mongoose";

const marketplaceLeadSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplaceListing",
      index: true,
      default: null,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      index: true,
      default: null,
    },
    spaceTitle: {
      type: String,
      trim: true,
      default: "",
    },
    spaceLocation: {
      type: String,
      trim: true,
      default: "",
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
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
          required: true,
        },
        authorName: {
          type: String,
          default: "",
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

marketplaceLeadSchema.index({ vendorId: 1, status: 1 });
marketplaceLeadSchema.index({ createdAt: -1 });

const MarketplaceLead =
  mongoose.models.MarketplaceLead ||
  mongoose.model("MarketplaceLead", marketplaceLeadSchema, "marketplace_leads");

export default MarketplaceLead;
