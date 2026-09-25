import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Amenity from "@/models/Amenity";
import { z } from "zod";

const amenitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const amenities = await Amenity.find().sort({ name: 1 }).lean();
    return apiSuccess(amenities);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch amenities", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = amenitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const amenity = await Amenity.create(parsed.data);
    return apiSuccess(amenity, 201, "Amenity created successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to create amenity", 500);
  }
}
