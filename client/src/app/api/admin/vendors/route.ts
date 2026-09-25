import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const vendors = await User.find({ role: "vendor" })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(vendors);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch vendors", 500);
  }
}
