import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAmenityDocument extends Document {
  name: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenityDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

amenitySchema.index({ isActive: 1 });

export const Amenity: Model<IAmenityDocument> =
  mongoose.models.MarketplaceAmenity ||
  mongoose.model<IAmenityDocument>(
    "MarketplaceAmenity",
    amenitySchema,
    "marketplace_amenities"
  );

export default Amenity;
