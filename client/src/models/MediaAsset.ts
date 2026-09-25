import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAssetDocument extends Document {
  cloudinaryPublicId: string;
  secureUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  width?: number;
  height?: number;
  format?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAssetDocument>(
  {
    cloudinaryPublicId: { type: String, required: true, unique: true },
    secureUrl: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
      required: true,
      index: true,
    },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
  },
  {
    timestamps: true,
  }
);

mediaAssetSchema.index({ uploadedBy: 1, createdAt: -1 });

export const MediaAsset: Model<IMediaAssetDocument> =
  mongoose.models.MarketplaceMediaAsset ||
  mongoose.model<IMediaAssetDocument>(
    "MarketplaceMediaAsset",
    mediaAssetSchema,
    "marketplace_media_assets"
  );

export default MediaAsset;
