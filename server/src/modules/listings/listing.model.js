import mongoose from "mongoose";
import "../marketplace-categories/category.model.js";
import "../amenities/amenity.model.js";
import "../marketplace-services/service.model.js";
import "../media/media.model.js";

const listingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplaceCategory",
      required: true,
      index: true,
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      unit: {
        type: String,
        enum: ["per-day", "per-hour", "per-month", "per-seat"],
        default: "per-month",
      },
    },
    capacity: {
      type: Number,
      default: 1,
    },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MarketplaceService",
      },
    ],
    amenityIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MarketplaceAmenity",
      },
    ],
    customAmenities: [
      {
        type: String,
        trim: true,
      },
    ],
    media: [
      {
        mediaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MarketplaceMediaAsset",
          required: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending_review", "approved", "rejected", "deleted"],
      default: "pending_review",
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
      required: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    approvedAt: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes specified in system design
listingSchema.index({ isLive: 1, categoryId: 1, "location.city": 1 });
listingSchema.index({ vendorId: 1, status: 1 });
listingSchema.index({ isLive: 1, "pricing.basePrice": 1 });

const Listing =
  mongoose.models.MarketplaceListing ||
  mongoose.model("MarketplaceListing", listingSchema, "marketplace_listings");

export default Listing;
