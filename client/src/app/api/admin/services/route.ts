import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { z } from "zod";

const adminServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  size: z.string().min(1, "Size is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  isGlobal: z.boolean().default(true),
  vendorId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const services = await Service.find({})
      .populate("vendorId", "name businessName email")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(services);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch services", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = adminServiceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();

    const newService = await Service.create({
      ...parsed.data,
      isGlobal: parsed.data.isGlobal ?? true,
      createdBy: auth.session.id,
      vendorId: parsed.data.isGlobal ? undefined : parsed.data.vendorId,
      isActive: true,
    });

    return apiSuccess(newService, 201, "Service created successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to create service", 500);
  }
}
