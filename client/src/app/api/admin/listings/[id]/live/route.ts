import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const liveToggleSchema = z.object({
  isLive: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = liveToggleSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const listing = await Listing.findById(id);
    if (!listing) return apiError("Listing not found", 404);

    // If making live, ensure it is approved
    if (parsed.data.isLive && listing.status !== "approved") {
      return apiError(
        "Cannot set listing live before it is approved. Please approve the listing first.",
        400
      );
    }

    listing.isLive = parsed.data.isLive;
    if (parsed.data.isLive && !listing.publishedAt) {
      listing.publishedAt = new Date();
    }
    listing.lastEditedBy = auth.session.id as any;

    await listing.save();

    await broadcastRealtime("listings", "LISTING_STATUS_CHANGED", {
      listingId: listing._id,
      title: listing.title,
      vendorId: listing.vendorId,
      status: listing.status,
      isLive: listing.isLive,
    });

    if (listing.vendorId) {
      await broadcastRealtime(`vendor:${listing.vendorId}:listings`, "LISTING_STATUS_CHANGED", {
        listingId: listing._id,
        title: listing.title,
        status: listing.status,
        isLive: listing.isLive,
      });
    }

    return apiSuccess(
      listing,
      200,
      `Listing is now ${parsed.data.isLive ? "LIVE on public marketplace" : "taken offline"}`
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to update live status", 500);
  }
}
