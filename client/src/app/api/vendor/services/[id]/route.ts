import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess, verifyVendorOwnership } from "@/lib/guard";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const service = await Service.findById(id);
    if (!service) {
      return apiError("Service not found", 404);
    }

    // Ownership check: vendor can only update their own service (not global services)
    if (service.isGlobal || !verifyVendorOwnership(auth.session, service.vendorId!)) {
      return apiError("Unauthorized to modify this service", 403);
    }

    Object.assign(service, parsed.data);
    await service.save();

    return apiSuccess(service, 200, "Service updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update service", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const service = await Service.findById(id);
    if (!service) {
      return apiError("Service not found", 404);
    }

    if (service.isGlobal || !verifyVendorOwnership(auth.session, service.vendorId!)) {
      return apiError("Unauthorized to delete this service", 403);
    }

    service.isActive = false;
    await service.save();

    return apiSuccess(null, 200, "Service deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete service", 500);
  }
}
