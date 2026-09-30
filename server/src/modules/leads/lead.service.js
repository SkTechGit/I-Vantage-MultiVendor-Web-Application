import Lead from "./lead.model.js";
import Service from "../services/service.model.js";
import ApiError from "../../utils/ApiError.js";
import { LEAD_MESSAGES } from "./lead.constants.js";
import { realtimeHub } from "../realtime/realtime.hub.js";
import { sendGeneralEnquiryNotification } from "../../utils/email.js";
import { createNotification } from "../notifications/notification.service.js";

// export const createLead = async (data) => {
//   const services = await Service.find({
//     _id: { $in: data.services },
//   });

//   if (services.length !== data.services.length) {
//     throw new ApiError(404, "One or more selected services not found.");
//   }

//   return await Lead.create(data);
// };

export const createLead = async (data) => {
  let serviceIds = data.services || [];

  // If no service is selected,
  // use the General Enquiry service
  if (serviceIds.length === 0) {
    const generalEnquiryService = await Service.findOne({
      name: "General Enquiry",
    }).select("_id");

    if (!generalEnquiryService) {
      throw new ApiError(
        500,
        'The "General Enquiry" service is not configured.'
      );
    }

    serviceIds = [generalEnquiryService._id];
  }

  // Validate services
  const services = await Service.find({
    _id: { $in: serviceIds },
  });

  if (services.length !== serviceIds.length) {
    throw new ApiError(
      404,
      "One or more selected services not found."
    );
  }

  // Create lead with selected service(s)
  // OR General Enquiry when no service was selected
  const lead = await Lead.create({
    ...data,
    services: serviceIds,
  });

  try {
    realtimeHub.broadcast("leads", "LEAD_CREATED", {
      leadId: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status || "NEW",
      createdAt: lead.createdAt,
      timestamp: Date.now(),
    });

    createNotification({
      title: `New Enquiry: ${lead.name || "Client Prospect"}`,
      message: `${lead.name} (${lead.phone || lead.email}) enquired for ${lead.location || "Workspace Solutions"}.`,
      category: "lead",
      priority: "high",
      actionUrl: "/admin/leads",
      metadata: { leadId: lead._id.toString(), email: lead.email, phone: lead.phone },
    }).catch((notifErr) => console.error("Admin notification error:", notifErr.message));
  } catch (rtErr) {
    console.error("Realtime lead broadcast error:", rtErr);
  }

  // Send automated confirmation email to client and alert to admin
  try {
    const firstService = services && services.length > 0 ? services[0].name : "Business & Workspace Solutions";
    sendGeneralEnquiryNotification({
      fullName: lead.fullName || lead.name,
      email: lead.email,
      mobile: lead.mobile || lead.phone,
      serviceName: firstService,
      location: lead.location || "Gurugram - Welldone Tech Park",
      message: lead.message,
    }).catch((mailErr) => console.error("General lead notification error:", mailErr.message));
  } catch (mailErr) {
    console.error("Error triggering general lead email:", mailErr.message);
  }

  return lead;
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

  try {
    realtimeHub.broadcast("leads", "LEAD_DELETED", {
      leadId: id.toString(),
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime lead delete broadcast error:", rtErr);
  }
};

export const updateLeadStatus = async (id, status) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, LEAD_MESSAGES.NOT_FOUND);
  }

  lead.status = status;

  await lead.save();

  try {
    realtimeHub.broadcast("leads", "LEAD_STATUS_CHANGED", {
      leadId: lead._id.toString(),
      status: lead.status,
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime lead status broadcast error:", rtErr);
  }

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