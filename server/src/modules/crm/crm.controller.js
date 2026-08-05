import asyncHandler from "../../utils/asyncHandler.js";

import * as crmService from "./crm.service.js";

import { CRM_MESSAGES } from "./crm.constants.js";

export const getCRMLeads =
  asyncHandler(async (req, res) => {
    const leads =
      await crmService.getCRMLeads();

    res.json({
      success: true,
      message: CRM_MESSAGES.FETCHED,
      data: leads,
    });
  });

export const getCRMLead =
  asyncHandler(async (req, res) => {
    const lead =
      await crmService.getCRMLead(
        req.params.id
      );

    res.json({
      success: true,
      message: CRM_MESSAGES.FETCHED_ONE,
      data: lead,
    });
  });

export const updateCRMLead =
  asyncHandler(async (req, res) => {
    const lead =
      await crmService.updateCRMLead(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      message: CRM_MESSAGES.UPDATED,
      data: lead,
    });
  });