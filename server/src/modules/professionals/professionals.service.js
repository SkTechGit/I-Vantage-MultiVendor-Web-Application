import mongoose from "mongoose";
import crypto from "crypto";
import slugify from "slugify";
import ProfessionalProfile from "./professionals.model.js";
import ProfessionalCategory from "./professionals.category.model.js";
import ProfileRevision from "./professionals.revision.model.js";
import ProfessionalArticle from "./professionals.article.model.js";
import ProfessionalEnquiry, { ProfessionalEnquiryEvent } from "./professionals.enquiry.model.js";
import { ProfessionalInvite, ProfessionalApplication } from "./professionals.invite.model.js";
import { ProfessionalAuditLog, ProfessionalDailyStat } from "./professionals.audit.model.js";
import Auth from "../auth/auth.model.js";
import User from "../users/user.model.js";
import {
  PROFILE_STATUS,
  VERIFICATION_STATUS,
  REVISION_STATUS,
  ENQUIRY_STATUS,
  INVITE_STATUS,
  APPLICATION_STATUS,
  DEFAULT_PROCESS_STEPS,
} from "./professionals.constants.js";
import { sendEmail, OFFICIAL_CONTACT } from "../../utils/email.js";
import { realtimeHub } from "../realtime/realtime.hub.js";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Computes profile completeness score (0 to 100) based on weighted rubric
 */
export const computeCompleteness = (prof) => {
  if (!prof) return 0;
  let score = 0;

  if (prof.photoUrl) score += 10;
  if (prof.aboutMd && prof.aboutMd.length >= 200) score += 15;
  if (prof.headline) score += 5;
  if (prof.summary) score += 5;
  if (prof.city) score += 5;
  if (prof.registrationBody && prof.registrationNumber) score += 5;
  if (prof.contactEmail || prof.contactPhone) score += 5;
  if (prof.qualification) score += 5;

  if (Array.isArray(prof.specializations) && prof.specializations.length >= 3) score += 8;
  if (Array.isArray(prof.expertise) && prof.expertise.length >= 3) score += 8;
  if (Array.isArray(prof.services) && prof.services.length >= 1) score += 10;
  if (Array.isArray(prof.experience) && prof.experience.length >= 1) score += 5;
  if (Array.isArray(prof.experience) && prof.experience.some((e) => e.kind === "EDUCATION")) score += 5;
  if (Array.isArray(prof.languages) && prof.languages.length >= 2) score += 3;
  if (Array.isArray(prof.consultationModes) && prof.consultationModes.length >= 1) score += 3;
  if (prof.consultationHours) score += 3;

  return Math.min(score, 100);
};

/**
 * Generates an SEO-clean unique slug
 */
export const generateUniqueSlug = async (fullName, categoryLabel = "") => {
  let roleSuffix = "";
  const lowerCat = String(categoryLabel).toLowerCase();
  if (lowerCat.includes("chartered")) roleSuffix = "ca";
  else if (lowerCat.includes("tax") || lowerCat.includes("gst")) roleSuffix = "gst-consultant";
  else if (lowerCat.includes("legal") || lowerCat.includes("advocate")) roleSuffix = "advocate";

  const base = slugify(`${fullName}${roleSuffix ? ` ${roleSuffix}` : ""}`, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = base;
  let counter = 2;
  while (await ProfessionalProfile.findOne({ slug, deletedAt: null })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

/**
 * Parses video URLs to extract platform and ID
 */
export const parseVideoUrl = (url = "") => {
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    let videoId = "";
    if (trimmed.includes("v=")) {
      videoId = trimmed.split("v=")[1]?.split("&")[0];
    } else if (trimmed.includes("youtu.be/")) {
      videoId = trimmed.split("youtu.be/")[1]?.split("?")[0];
    } else if (trimmed.includes("embed/")) {
      videoId = trimmed.split("embed/")[1]?.split("?")[0];
    } else if (trimmed.includes("shorts/")) {
      videoId = trimmed.split("shorts/")[1]?.split("?")[0];
    }
    return {
      platform: "YOUTUBE",
      externalId: videoId || "",
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "",
    };
  }

  if (trimmed.includes("instagram.com")) {
    return {
      platform: "INSTAGRAM",
      externalId: "",
      thumbnailUrl: "",
    };
  }

  return {
    platform: "OTHER",
    externalId: "",
    thumbnailUrl: "",
  };
};

/* -------------------------------------------------------------------------- */
/*                               Public Queries                               */
/* -------------------------------------------------------------------------- */

export const listPublishedProfessionals = async ({
  q,
  category,
  city,
  mode,
  language,
  sort = "featured",
  page = 1,
  limit = 12,
}) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (safePage - 1) * safeLimit;

  const filter = {
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
  };

  // Category filter
  if (category && category !== "all") {
    const cat = await ProfessionalCategory.findOne({
      slug: category.toLowerCase().trim(),
      isActive: true,
    });
    if (cat) {
      filter.categoryId = cat._id;
    }
  }

  // City filter
  if (city && city !== "all") {
    filter.city = { $regex: new RegExp(`^${city.trim()}$`, "i") };
  }

  // Consultation mode filter
  if (mode && mode !== "all") {
    filter.consultationModes = mode.toUpperCase();
  }

  // Language filter
  if (language && language !== "all") {
    filter.languages = { $regex: new RegExp(language.trim(), "i") };
  }

  // Text search
  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  // Sorting
  let sortOption = {};
  if (q && q.trim()) {
    sortOption = { score: { $meta: "textScore" }, isFeatured: -1, featuredRank: 1 };
  } else if (sort === "newest") {
    sortOption = { publishedAt: -1, createdAt: -1 };
  } else if (sort === "experience") {
    sortOption = { yearsExperience: -1, isFeatured: -1 };
  } else {
    // Default "featured"
    sortOption = { isFeatured: -1, featuredRank: 1, fullName: 1 };
  }

  const [items, total] = await Promise.all([
    ProfessionalProfile.find(filter)
      .populate("categoryId", "name label slug iconKey")
      .select(
        "slug fullName headline summary city state photoUrl photoAlt specializations yearsExperience consultationFeeInr consultationModes verificationStatus isFeatured featuredRank"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    ProfessionalProfile.countDocuments(filter),
  ]);

  return {
    data: items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

export const getDirectoryFacets = async () => {
  const [categories, cities, languages] = await Promise.all([
    ProfessionalCategory.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    ProfessionalProfile.distinct("city", { status: PROFILE_STATUS.PUBLISHED, deletedAt: null }),
    ProfessionalProfile.distinct("languages", { status: PROFILE_STATUS.PUBLISHED, deletedAt: null }),
  ]);

  // Count per category
  const categoryCounts = await ProfessionalProfile.aggregate([
    { $match: { status: PROFILE_STATUS.PUBLISHED, deletedAt: null } },
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  for (const c of categoryCounts) {
    if (c._id) countMap[c._id.toString()] = c.count;
  }

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: countMap[cat._id.toString()] || 0,
  }));

  return {
    categories: categoriesWithCounts,
    cities: cities.filter(Boolean).sort(),
    languages: Array.from(new Set(languages.flat().filter(Boolean))).sort(),
  };
};

export const getPublishedBySlug = async (slug) => {
  const clean = decodeURIComponent(String(slug)).toLowerCase().trim();
  const query = {
    $or: [
      { slug: clean },
      ...(mongoose.Types.ObjectId.isValid(clean) ? [{ _id: clean }] : []),
    ],
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
  };

  const profile = await ProfessionalProfile.findOne(query)
    .populate("categoryId", "name label slug iconKey")
    .lean();

  if (!profile) return null;

  // Mask direct contact details if in hub mode
  if (profile.contactMode === "hub") {
    profile.contactPhone = null;
    profile.contactWhatsapp = null;
    profile.contactEmail = null;
  }

  // Active services only
  profile.services = (profile.services || []).filter((s) => s.isActive);

  // Default process steps if empty
  if (!profile.processSteps || profile.processSteps.length === 0) {
    profile.processSteps = DEFAULT_PROCESS_STEPS;
  }

  return profile;
};

export const getRelatedProfessionals = async (categoryId, currentId, city) => {
  const query = {
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
    _id: { $ne: currentId },
    categoryId,
  };

  let related = await ProfessionalProfile.find(query)
    .populate("categoryId", "name label slug iconKey")
    .select("slug fullName headline city state photoUrl photoAlt specializations verificationStatus isFeatured")
    .sort({ isFeatured: -1, featuredRank: 1 })
    .limit(3)
    .lean();

  if (related.length < 3 && city) {
    const cityQuery = {
      status: PROFILE_STATUS.PUBLISHED,
      deletedAt: null,
      _id: { $ne: currentId, $nin: related.map((r) => r._id) },
      city: { $regex: new RegExp(`^${city}$`, "i") },
    };

    const cityMatches = await ProfessionalProfile.find(cityQuery)
      .populate("categoryId", "name label slug iconKey")
      .select("slug fullName headline city state photoUrl photoAlt specializations verificationStatus isFeatured")
      .limit(3 - related.length)
      .lean();

    related = [...related, ...cityMatches];
  }

  return related;
};

export const getArticlesByProfessionalSlug = async (slug) => {
  const profile = await ProfessionalProfile.findOne({
    slug: slug.toLowerCase().trim(),
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .populate("categoryId", "name label slug")
    .select("_id slug fullName headline qualification photoUrl city state categoryId");

  if (!profile) return null;

  const articles = await ProfessionalArticle.find({
    professionalId: profile._id,
    status: "PUBLISHED",
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("slug title excerpt coverImageUrl readingTimeMinutes publishedAt viewsCount tags")
    .lean();

  return {
    professional: profile,
    articles,
  };
};

export const getArticleBySlug = async (slug, articleSlug) => {
  const profile = await ProfessionalProfile.findOne({
    slug: slug.toLowerCase().trim(),
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .populate("categoryId", "name label slug")
    .select("_id slug fullName headline qualification photoUrl city state categoryId");

  if (!profile) return null;

  const article = await ProfessionalArticle.findOne({
    professionalId: profile._id,
    slug: articleSlug.toLowerCase().trim(),
    status: "PUBLISHED",
  }).lean();

  if (!article) return null;

  // Increment view count asynchronously
  ProfessionalArticle.updateOne({ _id: article._id }, { $inc: { viewsCount: 1 } }).exec().catch(() => {});

  return {
    professional: profile,
    article,
  };
};

/* -------------------------------------------------------------------------- */
/*                           Consultation Enquiries                           */
/* -------------------------------------------------------------------------- */

export const submitConsultationEnquiry = async (slug, input, meta = {}) => {
  const profile = await ProfessionalProfile.findOne({
    slug: slug.toLowerCase().trim(),
    status: PROFILE_STATUS.PUBLISHED,
    deletedAt: null,
  });

  if (!profile) {
    throw new Error("Professional profile not found or is currently inactive.");
  }

  // Anti-self-enquiry isolation: Prevent professionals from sending enquiries to their own listing
  if (meta?.userId && profile.userId && meta.userId.toString() === profile.userId.toString()) {
    const selfErr = new Error("You cannot submit a consultation enquiry to your own professional profile.");
    selfErr.status = 400;
    throw selfErr;
  }

  // Anti-abuse: Check duplicates in last 10 mins
  const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
  const duplicate = await ProfessionalEnquiry.findOne({
    professionalId: profile._id,
    phone: input.phone,
    createdAt: { $gte: tenMinsAgo },
  });

  if (duplicate) {
    return {
      id: duplicate._id.toString(),
      isDuplicate: true,
      message: "Your enquiry was already received. The expert will reach out shortly.",
    };
  }

  // Service lookup if supplied
  let matchedService = null;
  if (input.serviceId) {
    matchedService = profile.services?.find((s) => s._id.toString() === input.serviceId.toString());
  }

  // Create Enquiry
  const enquiry = await ProfessionalEnquiry.create({
    professionalId: profile._id,
    serviceId: matchedService ? matchedService._id : null,
    userId: meta.userId || null,
    name: input.name,
    phone: input.phone,
    email: input.email,
    mode: input.mode || "ONLINE",
    preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
    message: input.message,
    status: ENQUIRY_STATUS.NEW,
    sourcePath: meta.sourcePath || `/professionals/${profile.slug}`,
    consentAt: new Date(),
    consentVersion: "1.0",
    ipHash: meta.ipHash || null,
  });

  // Log initial event
  await ProfessionalEnquiryEvent.create({
    enquiryId: enquiry._id,
    actorId: meta.userId || null,
    type: "NOTIFIED",
    toStatus: ENQUIRY_STATUS.NEW,
    body: `Enquiry submitted for ${matchedService ? matchedService.title : "General Consultation"}.`,
  });

  // Track daily stats
  const todayStr = new Date().toISOString().split("T")[0];
  await ProfessionalDailyStat.findOneAndUpdate(
    { professionalId: profile._id, date: todayStr },
    { $inc: { enquiries: 1 } },
    { upsert: true, new: true }
  );

  // Email notifications (never blocking response)
  const serviceName = matchedService ? matchedService.title : "General Consultation";
  const proEmail = profile.contactEmail;

  // 1. Send notification to Professional if email is set
  if (proEmail) {
    sendEmail({
      to: proEmail,
      subject: `New Consultation Enquiry from ${input.name} | i-VANTAGE`,
      html: `
        <div style="font-family: sans-serif; color: #0b1533; line-height: 1.6;">
          <h2 style="color: #0A1F66;">New Client Consultation Request</h2>
          <p>Hello <strong>${profile.fullName}</strong>,</p>
          <p>You have received a new consultation request on your i-VANTAGE profile:</p>
          <div style="background: #F4F8FF; padding: 16px; border-radius: 8px; border-left: 4px solid #1E5BFF;">
            <p style="margin: 4px 0;"><strong>Client Name:</strong> ${input.name}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${input.phone}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${input.email}</p>
            <p style="margin: 4px 0;"><strong>Service Required:</strong> ${serviceName}</p>
            <p style="margin: 4px 0;"><strong>Consultation Mode:</strong> ${input.mode || "Online"}</p>
            <p style="margin: 8px 0 0;"><strong>Client Message:</strong></p>
            <p style="margin: 4px 0; font-style: italic; color: #4B5878;">"${input.message}"</p>
          </div>
          <p style="margin-top: 16px;">Please reach out to the client promptly.</p>
        </div>
      `,
    }).catch(console.error);
  }

  // 2. Send notification to i-VANTAGE Admin Team
  sendEmail({
    to: OFFICIAL_CONTACT.email,
    subject: `[Lead Alert] Professional Consultation: ${profile.fullName} (${serviceName})`,
    html: `
      <div style="font-family: sans-serif; color: #0b1533;">
        <h3 style="color: #0A1F66;">Professional Lead Received</h3>
        <p><strong>Professional:</strong> ${profile.fullName} (${profile.slug})</p>
        <p><strong>Client:</strong> ${input.name} (${input.phone}, ${input.email})</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Message:</strong> ${input.message}</p>
      </div>
    `,
  }).catch(console.error);

  // Realtime Alert
  if (realtimeHub && typeof realtimeHub.broadcast === "function") {
    realtimeHub.broadcast("notifications", "NEW_NOTIFICATION", {
      title: "New Professional Enquiry",
      message: `${input.name} requested consultation with ${profile.fullName}`,
      actionUrl: `/admin/professionals/enquiries`,
      timestamp: Date.now(),
    });
  }

  return {
    id: enquiry._id.toString(),
    isDuplicate: false,
    message: `Thank you, ${input.name}. ${profile.fullName.split(" ")[0]} will get back to you within one business day.`,
  };
};

/* -------------------------------------------------------------------------- */
/*                       Professional Self-Service (/me)                      */
/* -------------------------------------------------------------------------- */

export const getOwnProfile = async (userId) => {
  const profile = await ProfessionalProfile.findOne({
    userId,
    deletedAt: null,
  }).populate("categoryId", "name label slug iconKey");

  if (!profile) return null;

  // Fetch pending revision if any
  const pendingRevision = await ProfileRevision.findOne({
    professionalId: profile._id,
    status: REVISION_STATUS.PENDING,
  }).lean();

  return {
    ...profile.toObject(),
    pendingRevision,
  };
};

export const updateOwnProfileContent = async (userId, contentData) => {
  const profile = await ProfessionalProfile.findOne({ userId, deletedAt: null });
  if (!profile) throw new Error("Profile not found.");

  if (profile.status === PROFILE_STATUS.SUSPENDED || profile.status === PROFILE_STATUS.ARCHIVED) {
    throw new Error("Your profile is currently suspended or archived. Edits are locked.");
  }

  // Optimistic concurrency check
  if (contentData.version !== undefined && profile.version !== contentData.version) {
    const err = new Error("This profile was modified by another session. Please reload.");
    err.status = 409;
    throw err;
  }

  // Update allowed content fields
  const allowedFields = [
    "summary",
    "aboutMd",
    "city",
    "state",
    "languages",
    "yearsExperience",
    "consultationModes",
    "consultationHours",
    "responseTimeText",
    "consultationFeeInr",
    "servesAreas",
    "specializations",
    "industries",
    "clientTypes",
    "processSteps",
    "services",
    "expertise",
    "videos",
    "experience",
    "linkedinUrl",
    "websiteUrl",
    "contactPhone",
    "contactWhatsapp",
    "contactEmail",
  ];

  for (const field of allowedFields) {
    if (contentData[field] !== undefined) {
      profile[field] = contentData[field];
    }
  }

  profile.version = (profile.version || 1) + 1;
  profile.completeness = computeCompleteness(profile);
  await profile.save();

  // Audit log
  await ProfessionalAuditLog.create({
    actorId: userId,
    actorRole: "professional",
    action: "professional.update_content",
    entityType: "ProfessionalProfile",
    entityId: profile._id.toString(),
  });

  return profile;
};

export const requestIdentityRevision = async (userId, identityData) => {
  const profile = await ProfessionalProfile.findOne({ userId, deletedAt: null });
  if (!profile) throw new Error("Profile not found.");

  // If profile is in DRAFT or REJECTED, update directly
  if (profile.status === PROFILE_STATUS.DRAFT || profile.status === PROFILE_STATUS.REJECTED) {
    Object.assign(profile, identityData);
    profile.completeness = computeCompleteness(profile);
    await profile.save();
    return { appliedDirectly: true, profile };
  }

  // If PUBLISHED or PENDING_REVIEW: queue a revision diff
  const changes = {};
  for (const key of Object.keys(identityData)) {
    if (String(profile[key]) !== String(identityData[key])) {
      changes[key] = {
        from: profile[key],
        to: identityData[key],
      };
    }
  }

  if (Object.keys(changes).length === 0) {
    return { appliedDirectly: false, message: "No identity changes detected." };
  }

  const revision = await ProfileRevision.findOneAndUpdate(
    { professionalId: profile._id, status: REVISION_STATUS.PENDING },
    {
      professionalId: profile._id,
      requestedBy: userId,
      changes,
      status: REVISION_STATUS.PENDING,
    },
    { upsert: true, new: true }
  );

  return { appliedDirectly: false, revision };
};

export const submitProfileForReview = async (userId) => {
  const profile = await ProfessionalProfile.findOne({ userId, deletedAt: null });
  if (!profile) throw new Error("Profile not found.");

  const completeness = computeCompleteness(profile);
  if (completeness < 70) {
    throw new Error(`Profile completeness is ${completeness}%. It must be at least 70% to submit.`);
  }

  profile.status = PROFILE_STATUS.PENDING_REVIEW;
  profile.submittedAt = new Date();
  await profile.save();

  await ProfessionalAuditLog.create({
    actorId: userId,
    actorRole: "professional",
    action: "professional.submit_review",
    entityType: "ProfessionalProfile",
    entityId: profile._id.toString(),
  });

  return profile;
};

export const getOwnEnquiries = async (userId, statusFilter) => {
  const profile = await ProfessionalProfile.findOne({ userId, deletedAt: null });
  if (!profile) throw new Error("Profile not found.");

  const filter = { professionalId: profile._id };
  if (statusFilter && statusFilter !== "all") {
    filter.status = statusFilter.toUpperCase();
  }

  return await ProfessionalEnquiry.find(filter).sort({ createdAt: -1 }).lean();
};

export const updateOwnEnquiryStatus = async (userId, enquiryId, newStatus, note) => {
  const profile = await ProfessionalProfile.findOne({ userId, deletedAt: null });
  if (!profile) throw new Error("Profile not found.");

  const enquiry = await ProfessionalEnquiry.findOne({
    _id: enquiryId,
    professionalId: profile._id,
  });

  if (!enquiry) throw new Error("Enquiry not found.");

  const oldStatus = enquiry.status;
  enquiry.status = newStatus;
  if (!enquiry.firstResponseAt && oldStatus === ENQUIRY_STATUS.NEW && newStatus !== ENQUIRY_STATUS.NEW) {
    enquiry.firstResponseAt = new Date();
  }
  await enquiry.save();

  if (note || oldStatus !== newStatus) {
    await ProfessionalEnquiryEvent.create({
      enquiryId: enquiry._id,
      actorId: userId,
      type: note ? "NOTE" : "STATUS_CHANGED",
      fromStatus: oldStatus,
      toStatus: newStatus,
      body: note || `Status changed from ${oldStatus} to ${newStatus}.`,
    });
  }

  return enquiry;
};

/* -------------------------------------------------------------------------- */
/*                               Admin Operations                             */
/* -------------------------------------------------------------------------- */

export const adminListProfessionals = async ({ q, status, categoryId, page = 1, limit = 20 }) => {
  const filter = { deletedAt: null };
  if (status && status !== "all") filter.status = status.toUpperCase();
  if (categoryId && categoryId !== "all") filter.categoryId = categoryId;
  if (q && q.trim()) {
    filter.$or = [
      { fullName: { $regex: q.trim(), $options: "i" } },
      { headline: { $regex: q.trim(), $options: "i" } },
      { city: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const [items, total] = await Promise.all([
    ProfessionalProfile.find(filter)
      .populate("categoryId", "name label slug")
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    ProfessionalProfile.countDocuments(filter),
  ]);

  return {
    data: items,
    meta: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) || 1 },
  };
};

export const adminApproveProfile = async (id, actorId) => {
  const profile = await ProfessionalProfile.findById(id);
  if (!profile) throw new Error("Professional not found.");

  profile.status = PROFILE_STATUS.PUBLISHED;
  if (!profile.publishedAt) profile.publishedAt = new Date();
  await profile.save();

  await ProfessionalAuditLog.create({
    actorId,
    actorRole: "super_admin",
    action: "professional.approve",
    entityType: "ProfessionalProfile",
    entityId: profile._id.toString(),
  });

  return profile;
};

export const adminVerifyProfessional = async (id, registrationBody, registrationNumber, actorId) => {
  const profile = await ProfessionalProfile.findById(id);
  if (!profile) throw new Error("Professional not found.");

  profile.verificationStatus = VERIFICATION_STATUS.VERIFIED;
  profile.registrationBody = registrationBody || profile.registrationBody;
  profile.registrationNumber = registrationNumber || profile.registrationNumber;
  profile.verifiedAt = new Date();
  profile.verifiedBy = actorId;
  await profile.save();

  await ProfessionalAuditLog.create({
    actorId,
    actorRole: "super_admin",
    action: "professional.verify",
    entityType: "ProfessionalProfile",
    entityId: profile._id.toString(),
    diff: { registrationBody, registrationNumber },
  });

  return profile;
};

export const adminSuspendProfile = async (id, reason, actorId) => {
  const profile = await ProfessionalProfile.findById(id);
  if (!profile) throw new Error("Professional not found.");

  profile.status = PROFILE_STATUS.SUSPENDED;
  profile.rejectionReason = reason || "Suspended by Administrator";
  await profile.save();

  await ProfessionalAuditLog.create({
    actorId,
    actorRole: "super_admin",
    action: "professional.suspend",
    entityType: "ProfessionalProfile",
    entityId: profile._id.toString(),
    diff: { reason },
  });

  return profile;
};

export const adminApproveRevision = async (revisionId, actorId) => {
  const revision = await ProfileRevision.findById(revisionId);
  if (!revision) throw new Error("Revision not found.");
  if (revision.status !== "PENDING") throw new Error("Revision is already reviewed.");

  const profile = await ProfessionalProfile.findById(revision.professionalId);
  if (!profile) throw new Error("Professional profile not found.");

  // Apply proposed changes
  if (revision.changes) {
    if (revision.changes.fullName) profile.fullName = revision.changes.fullName;
    if (revision.changes.qualification) profile.qualification = revision.changes.qualification;
    if (revision.changes.registrationBody) profile.registrationBody = revision.changes.registrationBody;
    if (revision.changes.registrationNumber) profile.registrationNumber = revision.changes.registrationNumber;
  }

  await profile.save();

  revision.status = "APPROVED";
  revision.reviewedBy = actorId;
  revision.reviewedAt = new Date();
  await revision.save();

  await ProfessionalAuditLog.create({
    actorId,
    actorRole: "super_admin",
    action: "revision.approve",
    entityType: "ProfileRevision",
    entityId: revision._id.toString(),
    diff: revision.changes,
  });

  return { profile, revision };
};

export const adminRejectRevision = async (revisionId, reason, actorId) => {
  const revision = await ProfileRevision.findById(revisionId);
  if (!revision) throw new Error("Revision not found.");
  if (revision.status !== "PENDING") throw new Error("Revision is already reviewed.");

  revision.status = "REJECTED";
  revision.rejectionReason = reason || "Declined by compliance administrator.";
  revision.reviewedBy = actorId;
  revision.reviewedAt = new Date();
  await revision.save();

  await ProfessionalAuditLog.create({
    actorId,
    actorRole: "super_admin",
    action: "revision.reject",
    entityType: "ProfileRevision",
    entityId: revision._id.toString(),
    diff: { reason },
  });

  return revision;
};

export const adminGetProfessionalDetails = async (identifier) => {
  if (!identifier) {
    throw new Error("Identifier is required");
  }

  const clean = decodeURIComponent(String(identifier)).trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(clean);

  // Search by _id, userId, slug, contactEmail
  const filter = {
    deletedAt: null,
    $or: [
      ...(isObjectId ? [{ _id: clean }, { userId: clean }] : []),
      { slug: clean.toLowerCase() },
      { contactEmail: clean.toLowerCase() },
    ],
  };

  let profile = await ProfessionalProfile.findOne(filter)
    .populate("categoryId", "name label slug iconKey description")
    .populate("userId", "fullName email phone role status lastLogin createdAt")
    .lean();

  // If not found in ProfessionalProfile by direct query, check if an Auth or User exists with this email/id
  if (!profile) {
    let userDoc = null;
    if (isObjectId) {
      userDoc = (await Auth.findById(clean).lean()) || (await User.findById(clean).lean());
    }
    if (!userDoc) {
      userDoc =
        (await Auth.findOne({ email: clean.toLowerCase() }).lean()) ||
        (await User.findOne({ email: clean.toLowerCase() }).lean());
    }

    if (userDoc) {
      profile = await ProfessionalProfile.findOne({
        deletedAt: null,
        $or: [
          { userId: userDoc._id },
          { contactEmail: userDoc.email.toLowerCase() },
        ],
      })
        .populate("categoryId", "name label slug iconKey description")
        .populate("userId", "fullName email phone role status lastLogin createdAt")
        .lean();

      // If still no profile document exists, construct a synthetic baseline profile from userDoc
      if (!profile) {
        return {
          _id: userDoc._id,
          userId: userDoc,
          fullName: userDoc.fullName || userDoc.name || "Verified Professional",
          contactEmail: userDoc.email,
          contactPhone: userDoc.phone || null,
          headline: `${userDoc.fullName || userDoc.name} Practice & Business Advisory`,
          summary: `Empaneled advisor on the i-VANTAGE platform.`,
          city: "Gurugram",
          state: "Haryana",
          country: "India",
          status: userDoc.status === "active" ? "PUBLISHED" : "PENDING_REVIEW",
          verificationStatus: "VERIFIED",
          services: [],
          expertise: [],
          experience: [],
          languages: ["English", "Hindi"],
          yearsExperience: 0,
          createdAt: userDoc.createdAt,
        };
      }
    }
  }

  if (!profile) {
    throw new Error("Professional profile not found.");
  }

  // Cross-reference with User/Auth to ensure contactPhone/contactEmail are never missing if set in either place
  if (!profile.contactEmail && profile.userId?.email) {
    profile.contactEmail = profile.userId.email;
  }
  if (!profile.contactPhone && profile.userId?.phone) {
    profile.contactPhone = profile.userId.phone;
  }

  // Also query count of client enquiries for this professional
  const enquiryCount = await ProfessionalEnquiry.countDocuments({
    professionalId: profile._id,
    deletedAt: null,
  }).catch(() => 0);

  // Also check if any pending revisions exist
  const pendingRevision = await ProfileRevision.findOne({
    professionalId: profile._id,
    status: "PENDING",
  })
    .select("_id status createdAt proposedDiff")
    .lean()
    .catch(() => null);

  return {
    ...profile,
    enquiryCount,
    hasPendingRevision: Boolean(pendingRevision),
    pendingRevision,
  };
};
