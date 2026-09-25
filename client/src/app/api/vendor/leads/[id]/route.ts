import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess, verifyVendorOwnership } from "@/lib/guard";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "converted", "lost"]).optional(),
  noteText: z.string().trim().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const lead = await Lead.findById(id);
    if (!lead) return apiError("Lead not found", 404);

    // Strict multi-tenant isolation guard: Vendor can ONLY update leads belonging to their own properties
    if (!lead.vendorId || !verifyVendorOwnership(auth.session, lead.vendorId)) {
      return apiError("Unauthorized to update this lead", 403);
    }

    if (parsed.data.status) {
      lead.status = parsed.data.status;
    }

    if (parsed.data.noteText) {
      lead.notes.push({
        authorId: auth.session.id as any,
        text: parsed.data.noteText,
        createdAt: new Date(),
      });
    }

    await lead.save();

    await broadcastRealtime("leads", "LEAD_STATUS_CHANGED", {
      leadId: lead._id,
      status: lead.status,
      vendorId: lead.vendorId,
    });

    return apiSuccess(lead, 200, "Lead updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update lead", 500);
  }
}
