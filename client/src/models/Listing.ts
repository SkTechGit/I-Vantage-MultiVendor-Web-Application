import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
import "./Category";
import "./Service";
import "./Amenity";
import "./MediaAsset";

export interface IListingDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  location: {
    city: string;
    area: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    unit: "per-day" | "per-hour" | "per-month" | "per-seat";
  };
  capacity?: number;
  serviceIds: mongoose.Types.ObjectId[];
  amenityIds: mongoose.Types.ObjectId[];
  customAmenities: string[];
  media: {
    mediaId: mongoose.Types.ObjectId;
    order: number;
  }[];
  status: "draft" | "pending_review" | "approved" | "rejected" | "deleted";
  isLive: boolean;
  rejectionReason?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  publishedAt?: Date;
  lastEditedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListingDocument>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceCategory",
      required: true,
      index: true,
    },
    location: {
      city: { type: String, required: true, trim: true, lowercase: true, index: true },
      area: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR" },
      unit: {
        type: String,
        enum: ["per-day", "per-hour", "per-month", "per-seat"],
        default: "per-month",
      },
    },
    capacity: { type: Number, default: 1 },
    serviceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "MarketplaceService",
      },
    ],
    amenityIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "MarketplaceAmenity",
      },
    ],
    customAmenities: [{ type: String, trim: true }],
    media: [
      {
        mediaId: {
          type: Schema.Types.ObjectId,
          ref: "MarketplaceMediaAsset",
          required: true,
        },
        order: { type: Number, default: 0 },
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
    rejectionReason: { type: String, trim: true },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
    },
    approvedAt: { type: Date },
    publishedAt: { type: Date },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes specified in system design
listingSchema.index({ isLive: 1, categoryId: 1, "location.city": 1 });
listingSchema.index({ vendorId: 1, status: 1 });
listingSchema.index({ isLive: 1, "pricing.basePrice": 1 });

export const Listing: Model<IListingDocument> =
  mongoose.models.MarketplaceListing ||
  mongoose.model<IListingDocument>(
    "MarketplaceListing",
    listingSchema,
    "marketplace_listings"
  );

export default Listing;
