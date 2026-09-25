import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceDocument extends Document {
  name: string;
  size: string;
  price: number;
  description?: string;
  isGlobal: boolean;
  vendorId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IServiceDocument>(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true }, // e.g. "4-Seater Cabin", "Day Hot Desk"
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    isGlobal: { type: Boolean, default: false },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
      required: function (this: IServiceDocument) {
        return !this.isGlobal;
      },
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "MarketplaceUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ isGlobal: 1, vendorId: 1, isActive: 1 });

export const Service: Model<IServiceDocument> =
  mongoose.models.MarketplaceService ||
  mongoose.model<IServiceDocument>(
    "MarketplaceService",
    serviceSchema,
    "marketplace_services"
  );

export default Service;
