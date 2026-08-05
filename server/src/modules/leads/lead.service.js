import Lead from "./lead.model.js";
import Service from "../services/service.model.js";
import ApiError from "../../utils/ApiError.js";
import { LEAD_MESSAGES } from "./lead.constants.js";

export const createLead = async (data) => {
  const services = await Service.find({
    _id: { $in: data.services },
  });

  if (services.length !== data.services.length) {
    throw new ApiError(404, "One or more selected services not found.");
  }

  return await Lead.create(data);
};

export const getAllLeads = async () => {
  return await Lead.find()
    .populate({
      path: "services",
      select: "name slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .sort({
      createdAt: -1,
    });
};

export const getLeadById = async (id) => {
  const lead = await Lead.findById(id).populate({
    path: "services",
    select: "name slug",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  return lead;
};

export const updateLead = async (id, data) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  Object.assign(lead, data);

  await lead.save();

  return lead;
};

export const deleteLead = async (id) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  await lead.deleteOne();
};

export const updateLeadStatus = async (id, status) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  lead.status = status;

  await lead.save();

  return lead;
};

export const addLeadNote = async (id, note) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  lead.notes.push({
    note,
    createdAt: new Date(),
  });

  await lead.save();

  return lead;
};

export const addFollowUp = async (
  id,
  followUpDate,
  remark
) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  lead.followUps.push({
    followUpDate,
    remark,
  });

  await lead.save();

  return lead;
};

export const completeFollowUp = async (
  leadId,
  followUpId
) => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  const followUp = lead.followUps.id(
    followUpId
  );

  if (!followUp) {
    throw new ApiError(
      404,
      "Follow up not found."
    );
  }

  followUp.completed = true;

  followUp.completedAt = new Date();

  await lead.save();

  return lead;
};