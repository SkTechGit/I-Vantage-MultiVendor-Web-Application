import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Category from "@/models/Category";
import Amenity from "@/models/Amenity";
import { apiError, apiSuccess } from "@/lib/guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const category = searchParams.get("category") || searchParams.get("categoryId");
    const capacity = searchParams.get("capacity");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenities = searchParams.get("amenities");
    const sort = searchParams.get("sort");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    // NON-NEGOTIABLE RULE 6:
    // Every public/browse listing endpoint filters isLive=true at the database query level, always.
    const query: any = { isLive: true };

    if (city) {
      const c = city.toLowerCase().trim();
      if (c === "gurgaon" || c === "gurugram") {
        query["location.city"] = { $in: ["gurgaon", "gurugram"] };
      } else {
        query["location.city"] = c;
      }
    }

    if (area) {
      query["location.area"] = { $regex: area.trim(), $options: "i" };
    }

    if (category) {
      if (mongoose.isValidObjectId(category)) {
        query.categoryId = category;
      } else {
        const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() }).lean();
        if (catDoc) {
          query.categoryId = catDoc._id;
        }
      }
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity, 10) };
    }

    if (minPrice || maxPrice) {
      query["pricing.basePrice"] = {};
      if (minPrice) query["pricing.basePrice"].$gte = Number(minPrice);
      if (maxPrice) query["pricing.basePrice"].$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim()).filter(Boolean);
      if (amenityList.length > 0) {
        const validObjectIds = amenityList.filter((id) => mongoose.isValidObjectId(id));
        const matchedAmenities = await Amenity.find({
          $or: [
            { name: { $in: amenityList } },
            ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          ],
        }).select("_id").lean();

        const matchedIds = matchedAmenities.map((a) => a._id);
        query.$or = [
          ...(matchedIds.length > 0 ? [{ amenityIds: { $in: matchedIds } }] : []),
          { customAmenities: { $in: amenityList } },
        ];
      }
    }

    // Dynamic Sorting
    let sortObj: any = { "pricing.basePrice": 1, createdAt: -1 };
    if (sort === "price_desc") sortObj = { "pricing.basePrice": -1 };
    if (sort === "capacity_desc") sortObj = { capacity: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    const [total, listings] = await Promise.all([
      Listing.countDocuments(query),
      Listing.find(query)
        .populate("categoryId", "name slug")
        .populate("serviceIds", "name size price isGlobal")
        .populate("amenityIds", "name icon")
        .populate("media.mediaId", "secureUrl cloudinaryPublicId")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return apiSuccess({
      listings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch public listings", 500);
  }
}
