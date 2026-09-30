import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    format: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mediaAssetSchema.index({ uploadedBy: 1, createdAt: -1 });

const MediaAsset =
  mongoose.models.MarketplaceMediaAsset ||
  mongoose.model(
    "MarketplaceMediaAsset",
    mediaAssetSchema,
    "marketplace_media_assets"
  );

export default MediaAsset;
