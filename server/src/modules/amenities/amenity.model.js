import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

amenitySchema.index({ isActive: 1 });

const Amenity =
  mongoose.models.MarketplaceAmenity ||
  mongoose.model("MarketplaceAmenity", amenitySchema, "marketplace_amenities");

export default Amenity;
