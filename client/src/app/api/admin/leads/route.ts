import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    const status = searchParams.get("status");

    const filter: any = {};
    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.status = status;

    const leads = await Lead.find(filter)
      .populate("listingId", "title slug location")
      .populate("vendorId", "name businessName email phone")
      .populate("notes.authorId", "name role")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(leads);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch admin leads", 500);
  }
}
