import asyncHandler from "../../utils/asyncHandler.js";

import {
  createLeadSchema,
  updateLeadSchema,
} from "./lead.schema.js";

import * as leadService from "./lead.service.js";
import { dispatchLeadToCRM } from "../../services/crmLeadService.js";

import { LEAD_MESSAGES } from "./lead.constants.js";

export const createLead = asyncHandler(async (req, res) => {
  

  const validatedData = createLeadSchema.parse(req.body);
  const lead = await leadService.createLead(validatedData);

  res.status(201).json({
    success: true,
    message: LEAD_MESSAGES.CREATED,
    data: lead,
  });
});

export const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await leadService.getAllLeads();

  res.status(200).json({
    success: true,
    message: LEAD_MESSAGES.FETCHED,
    data: leads,
  });
});

export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);

  res.status(200).json({
    success: true,
    message: LEAD_MESSAGES.FETCHED_ONE,
    data: lead,
  });
});

export const updateLead = asyncHandler(async (req, res) => {
  const validatedData = updateLeadSchema.parse(req.body);

  const lead = await leadService.updateLead(
    req.params.id,
    validatedData
  );

  res.status(200).json({
    success: true,
    message: LEAD_MESSAGES.UPDATED,
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id);

  res.status(200).json({
    success: true,
    message: LEAD_MESSAGES.DELETED,
  });
});

export const updateLeadStatus =
  asyncHandler(async (req, res) => {
    const lead =
      await leadService.updateLeadStatus(
        req.params.id,
        req.body.status
      );

    res.json({
      success: true,
      message: "Lead status updated.",
      data: lead,
    });
  });

  export const addLeadNote =
  asyncHandler(async (req, res) => {
    const lead =
      await leadService.addLeadNote(
        req.params.id,
        req.body.note
      );

    res.json({
      success: true,
      message: "Note added.",
      data: lead,
    });
  });

  export const addFollowUp =
  asyncHandler(async (req, res) => {
    const lead =
      await leadService.addFollowUp(
        req.params.id,
        req.body.followUpDate,
        req.body.remark
      );

    res.json({
      success: true,
      message: "Follow up added.",
      data: lead,
    });
  });

  export const completeFollowUp =
  asyncHandler(async (req, res) => {
    const lead =
      await leadService.completeFollowUp(
        req.params.id,
        req.params.followUpId
      );

    res.json({
      success: true,
      message: "Follow up completed.",
      data: lead,
    });
  });

/**
 * Public Webhook: POST /api/v1/leads/webhook
 * Ingests inbound leads from external sources (WhatsApp BSP, Meta Ads, Google Ads, or other partner sites)
 * Automatically normalizes data and dispatches to Central CRM with local database backup.
 */
export const handleInboundWebhook = asyncHandler(async (req, res) => {
  const {
    channel = "other",
    brand = "i_vantage",
    name,
    fullName,
    phone,
    mobile,
    email,
    message,
    city,
    location,
    companyName,
    company_name,
    interestedIn,
    interested_in,
    sourceForm,
    source_form,
    externalId,
    external_id,
    metadata,
    businessDetails,
    business_details,
    services,
  } = req.body;

  const leadName = name || fullName || "Inbound Lead";
  const leadPhone = phone || mobile || null;

  if (!leadPhone && !email) {
    return res.status(400).json({
      success: false,
      message: "At least phone or email is required.",
    });
  }

  // Create local lead in MongoDB
  let localLead = null;
  try {
    localLead = await leadService.createLead({
      fullName: leadName,
      name: leadName,
      mobile: leadPhone,
      phone: leadPhone,
      email: email || undefined,
      message: message || `Inbound lead from ${channel}`,
      location: location || city || `Inbound: ${channel}`,
      companyName: companyName || company_name || undefined,
      services: [],
    });
  } catch (dbErr) {
    console.warn("[Inbound Webhook] Could not save to local lead DB:", dbErr.message);
  }

  // Dispatch to Central CRM
  const crmResult = await dispatchLeadToCRM({
    channel,
    brand,
    sourceForm: sourceForm || source_form || `inbound_webhook_${channel}`,
    externalId: externalId || external_id || (localLead ? localLead._id.toString() : null),
    name: leadName,
    phone: leadPhone,
    email: email || null,
    companyName: companyName || company_name || null,
    city: city || null,
    location: location || null,
    interestedIn: interestedIn || interested_in || null,
    message: message || null,
    interestedServices: Array.isArray(services) ? services : [],
    businessDetails: businessDetails || business_details || null,
    metadata: metadata || null,
  });

  res.status(200).json({
    success: true,
    message: "Inbound lead processed successfully.",
    data: {
      localLeadId: localLead ? localLead._id : null,
      crm: crmResult,
    },
  });
});