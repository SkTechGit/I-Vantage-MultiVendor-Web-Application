import connectDB from "@/lib/db";
import Amenity from "@/models/Amenity";
import { apiSuccess, apiError } from "@/lib/guard";

const INITIAL_AMENITIES = [
  { name: "High-Speed Wi-Fi", icon: "wifi" },
  { name: "Air Conditioning", icon: "wind" },
  { name: "24/7 Access", icon: "clock" },
  { name: "Power Backup", icon: "zap" },
  { name: "Ergonomic Chairs", icon: "armchair" },
  { name: "Cafeteria & Pantry", icon: "coffee" },
  { name: "Reception & Lounge", icon: "sofa" },
  { name: "Printing & Scanning", icon: "printer" },
  { name: "CCTV & Security", icon: "shield-check" },
  { name: "Parking Available", icon: "car" },
  { name: "Conference Access", icon: "users" },
  { name: "Housekeeping", icon: "sparkles" },
];

export async function GET() {
  try {
    await connectDB();
    let amenities = await Amenity.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    if (amenities.length === 0) {
      await Amenity.insertMany(INITIAL_AMENITIES);
      amenities = await Amenity.find({ isActive: true })
        .sort({ name: 1 })
        .lean();
    }

    return apiSuccess(amenities);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch amenities", 500);
  }
}
