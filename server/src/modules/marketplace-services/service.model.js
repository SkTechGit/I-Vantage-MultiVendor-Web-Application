import mongoose from "mongoose";

const marketplaceServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

marketplaceServiceSchema.index({ isGlobal: 1, vendorId: 1, isActive: 1 });

const MarketplaceService =
  mongoose.models.MarketplaceService ||
  mongoose.model(
    "MarketplaceService",
    marketplaceServiceSchema,
    "marketplace_services"
  );

export default MarketplaceService;
