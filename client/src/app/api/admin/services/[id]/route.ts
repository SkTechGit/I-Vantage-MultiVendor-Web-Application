import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { z } from "zod";

const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
  isGlobal: z.boolean().optional(),
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
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const service = await Service.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess(service, 200, "Service updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update service", 500);
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
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess(null, 200, "Service deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete service", 500);
  }
}
