import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    await connectDB();
    const query: any = {};
    if (auth.session.role === "vendor") {
      query.vendorId = auth.session.id;
    }
    const leads = await Lead.find(query)
      .populate("listingId", "title slug location")
      .populate("notes.authorId", "name role")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(leads);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch leads", 500);
  }
}
