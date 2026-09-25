import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ isActive: 1, sortOrder: 1 });

export const Category: Model<ICategoryDocument> =
  mongoose.models.MarketplaceCategory ||
  mongoose.model<ICategoryDocument>(
    "MarketplaceCategory",
    categorySchema,
    "marketplace_categories"
  );

export default Category;
