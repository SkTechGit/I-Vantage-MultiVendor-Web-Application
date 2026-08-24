import asyncHandler from "../../utils/asyncHandler.js";

import {
  createLeadSchema,
  updateLeadSchema,
} from "./lead.schema.js";

import * as leadService from "./lead.service.js";

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