import mongoose from "mongoose";

const marketplaceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

marketplaceCategorySchema.index({ isActive: 1, sortOrder: 1 });

const MarketplaceCategory =
  mongoose.models.MarketplaceCategory ||
  mongoose.model(
    "MarketplaceCategory",
    marketplaceCategorySchema,
    "marketplace_categories"
  );

export default MarketplaceCategory;
