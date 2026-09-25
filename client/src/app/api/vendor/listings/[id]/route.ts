import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess, verifyVendorOwnership } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const updateListingSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  location: z
    .object({
      city: z.string(),
      area: z.string(),
      address: z.string(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  pricing: z
    .object({
      basePrice: z.number().min(1),
      currency: z.string().default("INR"),
      unit: z.enum(["per-day", "per-hour", "per-month", "per-seat"]),
    })
    .optional(),
  capacity: z.number().min(1).optional(),
  serviceIds: z.array(z.string()).optional(),
  amenityIds: z.array(z.string()).optional(),
  customAmenities: z.array(z.string()).optional(),
  media: z
    .array(
      z.object({
        mediaId: z.string(),
        order: z.number(),
      })
    )
    .optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const listing = await Listing.findById(id)
      .populate("categoryId", "name slug")
      .populate("serviceIds", "name size price isGlobal")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl cloudinaryPublicId")
      .lean();

    if (!listing) return apiError("Listing not found", 404);

    if (!verifyVendorOwnership(auth.session, listing.vendorId)) {
      return apiError("Unauthorized to view this listing", 403);
    }

    return apiSuccess(listing);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch listing", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateListingSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const listing = await Listing.findById(id);
    if (!listing) return apiError("Listing not found", 404);

    if (!verifyVendorOwnership(auth.session, listing.vendorId)) {
      return apiError("Unauthorized to update this listing", 403);
    }

    // NON-NEGOTIABLE RULE 4:
    // If a VENDOR edits their own live listing, the listing must revert to
    // status="pending_review" and isLive must be forced back to false server-side
    // until SuperAdmin re-approves it.
    const wasLive = listing.isLive;
    if (wasLive) {
      listing.status = "pending_review";
      listing.isLive = false;
      listing.rejectionReason = undefined;
    }

    Object.assign(listing, parsed.data);
    listing.lastEditedBy = auth.session.id as any;

    await listing.save();

    await broadcastRealtime("listings", "LISTING_UPDATED", {
      listingId: listing._id,
      title: listing.title,
      vendorId: listing.vendorId,
      status: listing.status,
      isLive: listing.isLive,
    });

    await broadcastRealtime(`vendor:${listing.vendorId}:listings`, "LISTING_UPDATED", {
      listingId: listing._id,
      title: listing.title,
      status: listing.status,
      isLive: listing.isLive,
    });

    return apiSuccess(
      listing,
      200,
      wasLive
        ? "Listing updated and returned to pending review"
        : "Listing updated successfully"
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to update listing", 500);
  }
}

// NOTE: NO DELETE HANDLER EXISTS FOR VENDOR (NON-NEGOTIABLE RULE 3)
