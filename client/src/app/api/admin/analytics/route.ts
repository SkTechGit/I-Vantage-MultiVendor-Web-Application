import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Lead from "@/models/Lead";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();

    const [
      totalVendors,
      totalListings,
      liveListings,
      pendingApprovalListings,
      totalLeads,
      newLeads,
    ] = await Promise.all([
      User.countDocuments({ role: "vendor" }),
      Listing.countDocuments({}),
      Listing.countDocuments({ isLive: true }),
      Listing.countDocuments({ status: "pending_review" }),
      Lead.countDocuments({}),
      Lead.countDocuments({ status: "new" }),
    ]);

    const pendingListings = await Listing.find({ status: "pending_review" })
      .populate("vendorId", "name businessName email phone")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return apiSuccess({
      stats: {
        totalVendors,
        totalListings,
        liveListings,
        pendingApprovalListings,
        totalLeads,
        newLeads,
      },
      pendingListings,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch platform analytics", 500);
  }
}
