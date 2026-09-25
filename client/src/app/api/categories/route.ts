import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { apiSuccess, apiError } from "@/lib/guard";

const INITIAL_CATEGORIES = [
  { name: "Private Cabin", slug: "private-cabin", sortOrder: 1 },
  { name: "Meeting Room", slug: "meeting-room", sortOrder: 2 },
  { name: "Conference Room", slug: "conference-room", sortOrder: 3 },
  { name: "Day Pass", slug: "day-pass", sortOrder: 4 },
  { name: "Coworking Seat", slug: "coworking-seat", sortOrder: 5 },
];

export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    if (categories.length === 0) {
      // Auto seed initial categories
      await Category.insertMany(INITIAL_CATEGORIES);
      categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
    }

    return apiSuccess(categories);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch categories", 500);
  }
}
