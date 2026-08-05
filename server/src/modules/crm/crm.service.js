import Lead from "../leads/lead.model.js";
import ApiError from "../../utils/ApiError.js";

import { CRM_MESSAGES } from "./crm.constants.js";
import { LEAD_STATUS } from "../leads/lead.constants.js";

export const getCRMLeads = async () => {
  return await Lead.find({
    status: {
      $in: [
        LEAD_STATUS.QUALIFIED,
        LEAD_STATUS.CONVERTED,
        LEAD_STATUS.LOST,
      ],
    },
  })
    .populate({
      path: "services",
      select: "name",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .sort({
      updatedAt: -1,
    });
};

export const getCRMLead = async (id) => {
  const lead = await Lead.findById(id).populate({
    path: "services",
    select: "name",
    populate: {
      path: "category",
      select: "name",
    },
  });

  if (!lead) {
    throw new ApiError(
      404,
      CRM_MESSAGES.NOT_FOUND
    );
  }

  return lead;
};

export const updateCRMLead = async (
  id,
  data
) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(
      404,
      CRM_MESSAGES.NOT_FOUND
    );
  }

  Object.assign(lead, data);

  await lead.save();

  return lead;
};