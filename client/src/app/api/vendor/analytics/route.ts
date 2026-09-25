import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Service from "@/models/Service";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const vendorObjectId = new mongoose.Types.ObjectId(auth.session.id);

    const [totalListings, liveListings, pendingListings, totalServices] =
      await Promise.all([
        Listing.countDocuments({ vendorId: vendorObjectId }),
        Listing.countDocuments({ vendorId: vendorObjectId, isLive: true }),
        Listing.countDocuments({ vendorId: vendorObjectId, status: "pending_review" }),
        Service.countDocuments({
          $or: [{ vendorId: vendorObjectId }, { isGlobal: true }],
          isActive: true,
        }),
      ]);

    const recentListings = await Listing.find({ vendorId: vendorObjectId })
      .populate("categoryId", "name")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    return apiSuccess({
      stats: {
        totalListings,
        liveListings,
        pendingListings,
        totalServices,
      },
      recentListings,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch analytics", 500);
  }
}
