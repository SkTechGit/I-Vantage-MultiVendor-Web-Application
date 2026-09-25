import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  size: z.string().min(1, "Size (e.g. 4-Seater Cabin, Day Pass) is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const services = await Service.find({
      $or: [{ isGlobal: true }, { vendorId: auth.session.id }],
      isActive: true,
    })
      .sort({ isGlobal: -1, createdAt: -1 })
      .lean();

    return apiSuccess(services);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch services", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();

    // Vendor-created services are always scoped to themselves (isGlobal: false)
    const newService = await Service.create({
      ...parsed.data,
      isGlobal: false,
      vendorId: auth.session.id,
      createdBy: auth.session.id,
      isActive: true,
    });

    return apiSuccess(newService, 201, "Service created successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to create service", 500);
  }
}
