import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["active", "suspended"]),
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
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const vendor = await User.findById(id);
    if (!vendor) return apiError("Vendor not found", 404);

    vendor.status = parsed.data.status;
    await vendor.save();

    return apiSuccess(
      vendor,
      200,
      `Vendor status updated to ${parsed.data.status}`
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to update vendor status", 500);
  }
}
