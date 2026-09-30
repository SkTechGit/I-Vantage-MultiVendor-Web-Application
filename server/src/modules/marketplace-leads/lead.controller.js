import MarketplaceLead from "./lead.model.js";
import Listing from "../listings/listing.model.js";
import realtimeHub from "../realtime/realtime.hub.js";
import { sendLeadNotifications } from "../../utils/email.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Public: POST /api/v1/marketplace-leads
 * Submit lead enquiry for a coworking space
 */
export const createLead = async (req, res, next) => {
  try {
    const {
      listingId,
      listingTitle: bodyListingTitle,
      spaceTitle: bodySpaceTitle,
      spaceLocation: bodySpaceLocation,
      name,
      phone,
      email,
      message,
      source = "listing_enquiry",
    } = req.body;

    let vendorId = null;
    let vendorEmail = null;
    let vendorBusinessName = null;
    let listingTitle = (bodySpaceTitle || bodyListingTitle || "").trim() || "Workspace Enquiry";
    let spaceLocation = (bodySpaceLocation || "").trim();

    if (listingId) {
      try {
        const listing = await Listing.findById(listingId).populate(
          "vendorId",
          "email businessName fullName name"
        );
        if (listing) {
          if (listing.title) listingTitle = listing.title;
          if (listing.vendorId) {
            vendorId = listing.vendorId._id || listing.vendorId;
            vendorEmail = listing.vendorId.email || null;
            vendorBusinessName =
              listing.vendorId.businessName ||
              listing.vendorId.fullName ||
              listing.vendorId.name ||
              null;
          }
          if (listing.location) {
            const parts = [
              listing.location.address,
              listing.location.city,
              listing.location.state,
            ].filter(Boolean);
            if (parts.length > 0) spaceLocation = parts.join(", ");
          }
        }
      } catch (err) {
        console.warn("[MarketplaceLead] Error resolving listing by ID:", listingId, err.message);
      }
    }

    const lead = await MarketplaceLead.create({
      listingId: listingId || null,
      vendorId: vendorId || null,
      spaceTitle: listingTitle,
      spaceLocation: spaceLocation,
      name,
      phone,
      email,
      message,
      source,
      status: "new",
      notes: [],
    });

    // Realtime notification for live sync across desktop and phone
    try {
      if (vendorId) {
        realtimeHub.broadcastToUser(vendorId.toString(), "leads", "NEW_LEAD", {
          leadId: lead._id.toString(),
          name,
          phone,
          listingTitle,
          spaceTitle: listingTitle,
          spaceLocation,
          timestamp: Date.now(),
        });
      }
      realtimeHub.broadcast("leads", "NEW_LEAD", {
        leadId: lead._id.toString(),
        name,
        phone,
        listingTitle,
        spaceTitle: listingTitle,
        spaceLocation,
        vendorId: vendorId?.toString(),
        timestamp: Date.now(),
      });
      realtimeHub.broadcast("dashboard", "METRIC_UPDATE", {
        type: "lead",
        action: "created",
        timestamp: Date.now(),
      });

      // Dispatch dynamic platform notification for SuperAdmin bell
      createNotification({
        title: `New Commercial Lead: ${name}`,
        message: `${name} (${phone}) enquired for "${listingTitle || spaceLocation || 'Coworking Space'}".`,
        category: "lead",
        priority: "high",
        actionUrl: "/admin/leads",
        metadata: {
          leadId: lead._id.toString(),
          phone,
          email,
          listingTitle,
          spaceLocation,
        },
      }).catch((err) => console.error("Notification creation error:", err));
    } catch {}

    // Send email notifications asynchronously (non-blocking)
    sendLeadNotifications({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      clientMessage: message,
      spaceTitle: listingTitle,
      spaceLocation: spaceLocation,
      vendorEmail,
      vendorBusinessName,
      leadId: lead._id.toString(),
    }).catch((err) => console.error("Lead email notification error:", err));

    res.status(201).json({
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: GET /api/v1/marketplace-leads/vendor
 */
export const getVendorLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { vendorId: req.user._id };

    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
    const numericLimit = Math.min(50, Math.max(1, Number(limit)));

    const [leads, total] = await Promise.all([
      MarketplaceLead.find(filter)
        .populate("listingId", "title slug location")
        .sort("-createdAt")
        .skip(skip)
        .limit(numericLimit),
      MarketplaceLead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / numericLimit),
        limit: numericLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: PATCH /api/v1/marketplace-leads/vendor/:id
 * Update status & add note
 */
export const updateVendorLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const lead = await MarketplaceLead.findOne({ _id: id, vendorId: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found or unauthorized." });
    }

    if (status) lead.status = status;
    if (note && note.trim()) {
      lead.notes.push({
        authorId: req.user._id,
        authorName: req.user.name || req.user.fullName || "Vendor",
        text: note.trim(),
        createdAt: new Date(),
      });
    }

    await lead.save();

    // Broadcast realtime event for live sync on desktop & phone
    try {
      realtimeHub.broadcast("leads", "LEAD_UPDATED", {
        leadId: lead._id.toString(),
        status: lead.status,
        notesCount: lead.notes?.length || 0,
        timestamp: Date.now(),
      });
      realtimeHub.broadcast("dashboard", "METRIC_UPDATE", {
        type: "lead",
        action: "updated",
        timestamp: Date.now(),
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: GET all marketplace leads
 */
export const getAdminLeads = async (req, res, next) => {
  try {
    const { status, vendorId, page = 1, limit = 30 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (vendorId) filter.vendorId = vendorId;

    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
    const numericLimit = Math.min(100, Math.max(1, Number(limit)));

    const [leads, total] = await Promise.all([
      MarketplaceLead.find(filter)
        .populate("listingId", "title slug location")
        .populate("vendorId", "name fullName email businessName")
        .sort("-createdAt")
        .skip(skip)
        .limit(numericLimit),
      MarketplaceLead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / numericLimit),
        limit: numericLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: PATCH lead status and note
 */
export const updateAdminLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const lead = await MarketplaceLead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    if (status) lead.status = status;
    if (note && note.trim()) {
      lead.notes.push({
        authorId: req.user._id,
        authorName: req.user.name || req.user.fullName || "SuperAdmin",
        text: note.trim(),
        createdAt: new Date(),
      });
    }

    await lead.save();
    await lead.populate([
      { path: "listingId", select: "title slug location" },
      { path: "vendorId", select: "name fullName email businessName" },
    ]);

    // Broadcast realtime event for live sync on desktop & phone
    try {
      realtimeHub.broadcast("leads", "LEAD_UPDATED", {
        leadId: lead._id.toString(),
        status: lead.status,
        notesCount: lead.notes?.length || 0,
        timestamp: Date.now(),
      });
      if (lead.vendorId) {
        const vId = lead.vendorId._id ? lead.vendorId._id.toString() : lead.vendorId.toString();
        realtimeHub.broadcastToUser(vId, "leads", "LEAD_UPDATED", {
          leadId: lead._id.toString(),
          status: lead.status,
          timestamp: Date.now(),
        });
      }
      realtimeHub.broadcast("dashboard", "METRIC_UPDATE", {
        type: "lead",
        action: "updated",
        timestamp: Date.now(),
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: DELETE a marketplace lead (Cleanup spam/test leads)
 */
export const deleteAdminLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await MarketplaceLead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    // Broadcast realtime event for live sync on desktop & phone
    try {
      realtimeHub.broadcast("leads", "LEAD_DELETED", {
        leadId: id.toString(),
        timestamp: Date.now(),
      });
      realtimeHub.broadcast("dashboard", "METRIC_UPDATE", {
        type: "lead",
        action: "deleted",
        timestamp: Date.now(),
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
