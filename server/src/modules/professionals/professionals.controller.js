import mongoose from "mongoose";
import * as service from "./professionals.service.js";
import {
  createEnquirySchema,
  contentUpdateSchema,
  identityUpdateSchema,
  serviceSchema,
  expertiseSchema,
  videoSchema,
  experienceSchema,
  categorySchema,
} from "./professionals.validation.js";
import ProfessionalProfile from "./professionals.model.js";
import ProfessionalCategory from "./professionals.category.model.js";
import ProfileRevision from "./professionals.revision.model.js";
import ProfessionalEnquiry from "./professionals.enquiry.model.js";

/* -------------------------------------------------------------------------- */
/*                               Public Handlers                              */
/* -------------------------------------------------------------------------- */

export const listPublic = async (req, res, next) => {
  try {
    const { q, category, city, mode, language, sort, page, limit } = req.query;
    const result = await service.listPublishedProfessionals({
      q,
      category,
      city,
      mode,
      language,
      sort,
      page,
      limit,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getFacets = async (req, res, next) => {
  try {
    const facets = await service.getDirectoryFacets();
    res.status(200).json({ success: true, data: facets });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await ProfessionalCategory.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const profile = await service.getPublishedBySlug(slug);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Professional profile not found." });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const getRelated = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const clean = decodeURIComponent(String(slug)).toLowerCase().trim();
    const profile = await ProfessionalProfile.findOne({
      $or: [
        { slug: clean },
        ...(mongoose.Types.ObjectId.isValid(clean) ? [{ _id: clean }] : []),
      ],
      deletedAt: null,
    });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Professional not found." });
    }
    const related = await service.getRelatedProfessionals(profile.categoryId, profile._id, profile.city);
    res.status(200).json({ success: true, data: related });
  } catch (error) {
    next(error);
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const cleanSlug = decodeURIComponent(String(req.params.slug)).toLowerCase().trim();
    const result = await service.getArticlesByProfessionalSlug(cleanSlug);
    if (!result) {
      return res.status(404).json({ success: false, message: "Professional not found." });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlug = async (req, res, next) => {
  try {
    const cleanSlug = decodeURIComponent(String(req.params.slug)).toLowerCase().trim();
    const cleanArticleSlug = decodeURIComponent(String(req.params.articleSlug)).toLowerCase().trim();
    const result = await service.getArticleBySlug(cleanSlug, cleanArticleSlug);
    if (!result) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const submitEnquiry = async (req, res, next) => {
  try {
    const cleanSlug = decodeURIComponent(String(req.params.slug)).toLowerCase().trim();
    const validated = createEnquirySchema.parse(req.body);

    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
    const meta = {
      ipHash: clientIp,
      userId: req.user?._id || null,
      sourcePath: req.body.sourcePath || `/professionals/${cleanSlug}`,
    };

    const result = await service.submitConsultationEnquiry(cleanSlug, validated, meta);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                       Professional Self-Service (/me)                      */
/* -------------------------------------------------------------------------- */

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await service.getOwnProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: "No professional profile linked to your account." });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateMyContent = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const validated = contentUpdateSchema.parse(req.body);
    const updated = await service.updateOwnProfileContent(userId, validated);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: error.errors[0]?.message, errors: error.errors });
    }
    next(error);
  }
};

export const uploadProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No photo file provided." });
    }
    const updated = await service.uploadOwnProfilePhoto(userId, req.file);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Profile photo uploaded and updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const removeProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await service.removeOwnProfilePhoto(userId);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Profile photo removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCoverPhoto = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No cover file provided." });
    }
    const updated = await service.uploadOwnCoverPhoto(userId, req.file);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Cover photo uploaded and updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const removeCoverPhoto = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await service.removeOwnCoverPhoto(userId);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Cover photo removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileDocument = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No document file provided." });
    }
    const { title, kind, expiryDate } = req.body;
    const updated = await service.uploadOwnProfileDocument(userId, req.file, {
      title,
      kind,
      expiryDate,
    });
    res.status(200).json({
      success: true,
      data: updated,
      message: "Compliance document uploaded successfully to Vault!",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfileDocument = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { docId } = req.params;
    const updated = await service.deleteOwnProfileDocument(userId, docId);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Document removed from Vault.",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPortfolio = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No portfolio file provided." });
    }
    const { title, description, externalUrl } = req.body;
    const updated = await service.uploadOwnPortfolio(userId, req.file, {
      title,
      description,
      externalUrl,
    });
    res.status(200).json({
      success: true,
      data: updated,
      message: "Practice portfolio uploaded successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const removePortfolio = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await service.removeOwnPortfolio(userId);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Portfolio removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const requestIdentityChange = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const validated = identityUpdateSchema.parse(req.body);
    const result = await service.requestIdentityRevision(userId, validated);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: error.errors[0]?.message, errors: error.errors });
    }
    next(error);
  }
};

export const submitForReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const result = await service.submitProfileForReview(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyEnquiries = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status } = req.query;
    const enquiries = await service.getOwnEnquiries(userId, status);
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateMyEnquiry = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { status, note } = req.body;
    const updated = await service.updateOwnEnquiryStatus(userId, id, status, note);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               Admin Operations                             */
/* -------------------------------------------------------------------------- */

export const adminList = async (req, res, next) => {
  try {
    const { q, status, categoryId, page, limit } = req.query;
    const result = await service.adminListProfessionals({ q, status, categoryId, page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const adminGetDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await service.adminGetProfessionalDetails(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminApprove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = req.user._id || req.user.id;
    const result = await service.adminApproveProfile(id, actorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminVerify = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { registrationBody, registrationNumber } = req.body;
    const actorId = req.user._id || req.user.id;
    const result = await service.adminVerifyProfessional(id, registrationBody, registrationNumber, actorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminSuspend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const actorId = req.user._id || req.user.id;
    const result = await service.adminSuspendProfile(id, reason, actorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminListRevisions = async (req, res, next) => {
  try {
    const revisions = await ProfileRevision.find({ status: "PENDING" })
      .populate("professionalId", "fullName slug headline photoUrl registrationBody registrationNumber qualification")
      .populate("requestedBy", "fullName email")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    next(error);
  }
};

export const adminApproveRevision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = req.user._id || req.user.id;
    const result = await service.adminApproveRevision(id, actorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminRejectRevision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const actorId = req.user._id || req.user.id;
    const result = await service.adminRejectRevision(id, reason, actorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminListEnquiries = async (req, res, next) => {
  try {
    const { status, professionalId, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status.toUpperCase();
    if (professionalId) filter.professionalId = professionalId;

    const [items, total] = await Promise.all([
      ProfessionalEnquiry.find(filter)
        .populate("professionalId", "fullName slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10))
        .lean(),
      ProfessionalEnquiry.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, data: items, meta: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) } });
  } catch (error) {
    next(error);
  }
};
