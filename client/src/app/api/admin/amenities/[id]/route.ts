import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Amenity from "@/models/Amenity";
import { z } from "zod";

const updateAmenitySchema = z.object({
  name: z.string().min(2).optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
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
    const parsed = updateAmenitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const amenity = await Amenity.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!amenity) return apiError("Amenity not found", 404);

    return apiSuccess(amenity, 200, "Amenity updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update amenity", 500);
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
    const amenity = await Amenity.findByIdAndDelete(id);
    if (!amenity) return apiError("Amenity not found", 404);

    return apiSuccess(null, 200, "Amenity deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete amenity", 500);
  }
}
