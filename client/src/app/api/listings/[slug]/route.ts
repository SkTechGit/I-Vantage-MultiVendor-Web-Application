import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectDB();
    const listing = await Listing.findOne({ slug })
      .populate("vendorId", "name businessName email phone")
      .populate("categoryId", "name slug")
      .populate("serviceIds", "name size price description isGlobal")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl cloudinaryPublicId")
      .lean();

    if (!listing) {
      return apiError("Listing not found", 404);
    }

    // 404 unless live (or requester owns it / is SuperAdmin)
    if (!listing.isLive) {
      const session = await getSessionUser(req);
      const isOwner = session && session.id === listing.vendorId?._id?.toString();
      const isSuperAdmin = session && session.role === "superadmin";

      if (!isOwner && !isSuperAdmin) {
        return apiError("Listing not found", 404);
      }
    }

    return apiSuccess(listing);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch listing details", 500);
  }
}
