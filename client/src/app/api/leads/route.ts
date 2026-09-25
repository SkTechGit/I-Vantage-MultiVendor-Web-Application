import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { apiError, apiSuccess } from "@/lib/guard";
import { sendLeadNotifications } from "@/lib/email";
import { z } from "zod";
import { broadcastRealtime } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const leadSubmissionSchema = z.object({
  listingId: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  source: z
    .enum(["listing_enquiry", "contact_form", "callback_request"])
    .default("listing_enquiry"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();

    let vendorId: any = undefined;
    let spaceTitle = "Commercial Coworking Workspace";
    let spaceLocation = "";
    let vendorName = "";
    let vendorEmail = "";
    let vendorBusinessName = "";

    if (parsed.data.listingId) {
      const listing = await Listing.findById(parsed.data.listingId)
        .select("title location vendorId")
        .populate("vendorId", "name email businessName phone");

      if (listing) {
        spaceTitle = listing.title;
        if (listing.location) {
          spaceLocation = `${listing.location.area || ""}, ${listing.location.city || ""}`.trim();
        }
        if (listing.vendorId) {
          const v: any = listing.vendorId;
          vendorId = v._id || v.id;
          vendorName = v.name || "";
          vendorEmail = v.email || "";
          vendorBusinessName = v.businessName || "";
        }
      }
    }

    const lead = await Lead.create({
      ...parsed.data,
      email: parsed.data.email || undefined,
      vendorId,
      status: "new",
      notes: [],
    });

    await broadcastRealtime("leads", "LEAD_CREATED", {
      leadId: lead._id,
      name: lead.name,
      phone: lead.phone,
      vendorId: lead.vendorId,
      source: lead.source,
      createdAt: lead.createdAt,
    });

    if (vendorId) {
      await broadcastRealtime(`vendor:${vendorId}:leads`, "LEAD_CREATED", {
        leadId: lead._id,
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
        createdAt: lead.createdAt,
      });
    }

    // Asynchronously trigger dual email notifications (fire-and-forget without blocking response)
    sendLeadNotifications({
      clientName: parsed.data.name,
      clientPhone: parsed.data.phone,
      clientEmail: parsed.data.email || undefined,
      clientMessage: parsed.data.message || undefined,
      spaceTitle,
      spaceLocation,
      vendorName,
      vendorEmail,
      vendorBusinessName,
      leadId: lead._id.toString(),
    }).catch((mailErr) => {
      console.warn("Background email notification warning:", mailErr?.message || mailErr);
    });

    return apiSuccess(
      lead,
      201,
      "Thank you! Your enquiry has been received. Our team will contact you shortly."
    );
  } catch (error: any) {
    return apiError(error.message || "Failed to submit enquiry", 500);
  }
}
