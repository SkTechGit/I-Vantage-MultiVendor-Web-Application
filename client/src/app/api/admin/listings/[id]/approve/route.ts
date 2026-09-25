import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const approveSchema = z.object({
  status: z.enum(["approved", "rejected", "pending_review"]),
  rejectionReason: z.string().optional(),
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
    const parsed = approveSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const listing = await Listing.findById(id);
    if (!listing) return apiError("Listing not found", 404);

    listing.status = parsed.data.status;
    if (parsed.data.status === "approved") {
      listing.approvedBy = auth.session.id as any;
      listing.approvedAt = new Date();
      listing.rejectionReason = undefined;
    } else if (parsed.data.status === "rejected") {
      listing.rejectionReason = parsed.data.rejectionReason || "Listing rejected by administrator";
      listing.isLive = false; // Cannot be live if rejected
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
      `Listing marked as ${parsed.data.status}`
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to update approval status", 500);
  }
}
