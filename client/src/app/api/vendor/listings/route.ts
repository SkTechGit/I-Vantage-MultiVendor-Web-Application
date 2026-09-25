import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Category from "@/models/Category";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const rand = Math.random().toString(36).substring(2, 7);
  return `${base}-${rand}`;
}

const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    address: z.string().min(1, "Address is required"),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  pricing: z.object({
    basePrice: z.number().min(1, "Price must be greater than 0"),
    currency: z.string().default("INR"),
    unit: z.enum(["per-day", "per-hour", "per-month", "per-seat"]),
  }),
  capacity: z.number().min(1).optional(),
  serviceIds: z.array(z.string()).default([]),
  amenityIds: z.array(z.string()).default([]),
  customAmenities: z.array(z.string()).default([]),
  media: z
    .array(
      z.object({
        mediaId: z.string(),
        order: z.number(),
      })
    )
    .min(1, "At least one image is required"),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const listings = await Listing.find({ vendorId: auth.session.id })
      .populate("categoryId", "name slug")
      .populate("serviceIds", "name size price isGlobal")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl cloudinaryPublicId")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(listings);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch vendor listings", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();

    // Verify category exists
    const categoryExists = await Category.findById(parsed.data.categoryId);
    if (!categoryExists) {
      return apiError("Selected category is invalid", 400);
    }

    const slug = generateSlug(parsed.data.title);

    // NON-NEGOTIABLE RULE 1:
    // Vendor's NEW listing is never publicly visible on creation:
    // status="pending_review", isLive=false enforced server-side.
    // vendorId is forced to session.id.
    const newListing = await Listing.create({
      ...parsed.data,
      vendorId: auth.session.id,
      slug,
      status: "pending_review",
      isLive: false,
      lastEditedBy: auth.session.id,
    });

    await broadcastRealtime("listings", "LISTING_CREATED", {
      listingId: newListing._id,
      title: newListing.title,
      vendorId: auth.session.id,
      status: newListing.status,
    });

    await broadcastRealtime(`vendor:${auth.session.id}:listings`, "LISTING_CREATED", {
      listingId: newListing._id,
      title: newListing.title,
      status: newListing.status,
    });

    return apiSuccess(newListing, 201, "Listing created and submitted for review");
  } catch (error: any) {
    return apiError(error.message || "Failed to create listing", 500);
  }
}
