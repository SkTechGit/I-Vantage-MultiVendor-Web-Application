import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const listing = await Listing.findById(id)
      .populate("vendorId", "name businessName email phone")
      .populate("categoryId", "name slug")
      .populate("serviceIds", "name size price isGlobal")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl cloudinaryPublicId")
      .lean();

    if (!listing) return apiError("Listing not found", 404);

    return apiSuccess(listing);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch listing", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    await connectDB();

    const listing = await Listing.findById(id);
    if (!listing) return apiError("Listing not found", 404);

    // NON-NEGOTIABLE RULE 4:
    // SuperAdmin edits to an already-live listing KEEP it live (trusted edit, no re-review).
    // Do NOT revert isLive or status when superadmin edits.
    Object.assign(listing, body);
    listing.lastEditedBy = auth.session.id as any;

    await listing.save();

    await broadcastRealtime("listings", "LISTING_UPDATED", {
      listingId: listing._id,
      title: listing.title,
      vendorId: listing.vendorId,
      status: listing.status,
      isLive: listing.isLive,
    });

    return apiSuccess(listing, 200, "Listing updated successfully by SuperAdmin");
  } catch (error: any) {
    return apiError(error.message || "Failed to update listing", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) return apiError("Listing not found", 404);

    await broadcastRealtime("listings", "LISTING_DELETED", {
      listingId: id,
    });

    return apiSuccess(null, 200, "Listing deleted successfully by SuperAdmin");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete listing", 500);
  }
}
