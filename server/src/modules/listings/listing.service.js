import mongoose from "mongoose";
import Listing from "./listing.model.js";
import Service from "../marketplace-services/service.model.js";
import AuditLog from "../auth/audit-log.model.js";
import realtimeHub from "../realtime/realtime.hub.js";
import slugify from "slugify";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Format listing to public DTO (strips internal & sensitive fields)
 */
export const toPublicListingDTO = (listing) => {
  if (!listing) return null;
  const l = listing.toObject ? listing.toObject() : listing;
  const mediaList = (l.media || []).map((m) => {
    const secureUrl = m.mediaId?.secureUrl || m.secureUrl || m.url || "";
    return {
      mediaId: {
        _id: m.mediaId?._id || m.mediaId,
        secureUrl,
      },
      url: secureUrl,
      order: m.order || 0,
    };
  });

  return {
    _id: l._id?.toString(),
    id: l._id?.toString(),
    title: l.title,
    slug: l.slug,
    description: l.description,
    category: l.categoryId,
    categoryId: l.categoryId,
    location: l.location,
    pricing: l.pricing,
    capacity: l.capacity,
    services: l.serviceIds || [],
    serviceIds: l.serviceIds || [],
    amenities: l.amenityIds || [],
    amenityIds: l.amenityIds || [],
    customAmenities: l.customAmenities || [],
    media: mediaList,
    status: l.status,
    isLive: l.isLive,
    publishedAt: l.publishedAt,
    createdAt: l.createdAt,
    vendorId: {
      name: l.vendorId?.name || l.vendorId?.fullName || "Verified Partner",
      businessName: l.vendorId?.businessName || "i-VANTAGE Verified Partner",
    },
  };
};

/**
 * Format listing to vendor DTO (includes rejection reason & review status)
 */
export const toVendorListingDTO = (listing) => {
  if (!listing) return null;
  const l = listing.toObject ? listing.toObject() : listing;
  const idStr = l._id?.toString() || l.id?.toString();
  return {
    _id: idStr,
    id: idStr,
    title: l.title,
    slug: l.slug,
    description: l.description,
    categoryId: l.categoryId?._id || l.categoryId,
    category: l.categoryId,
    location: l.location,
    pricing: l.pricing,
    capacity: l.capacity,
    serviceIds: l.serviceIds || [],
    amenityIds: l.amenityIds || [],
    customAmenities: l.customAmenities || [],
    media: l.media || [],
    status: l.status,
    isLive: l.isLive,
    rejectionReason: l.rejectionReason,
    publishedAt: l.publishedAt,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
};

/**
 * Format listing to admin DTO (full inspection view)
 */
export const toAdminListingDTO = (listing) => {
  if (!listing) return null;
  const l = listing.toObject ? listing.toObject() : listing;
  const idStr = l._id?.toString() || l.id?.toString();
  return {
    ...l,
    _id: idStr,
    id: idStr,
  };
};

/**
 * Public Listing Browse (Strictly isLive: true)
 */
export const getPublicListings = async (query = {}) => {
  const {
    city,
    category,
    minPrice,
    maxPrice,
    capacity,
    amenities,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = query;

  const filter = { isLive: true, status: "approved" };

  if (city) {
    filter["location.city"] = { $regex: new RegExp(`^${city.trim()}$`, "i") };
  }

  if (category) {
    filter.categoryId = category;
  }

  if (minPrice || maxPrice) {
    filter["pricing.basePrice"] = {};
    if (minPrice) filter["pricing.basePrice"].$gte = Number(minPrice);
    if (maxPrice) filter["pricing.basePrice"].$lte = Number(maxPrice);
  }

  if (capacity) {
    filter.capacity = { $gte: Number(capacity) };
  }

  if (amenities) {
    const amenityArray = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((s) => s.trim());
    if (amenityArray.length > 0) {
      filter.amenityIds = { $in: amenityArray };
    }
  }

  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const numericLimit = Math.min(50, Math.max(1, Number(limit)));

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("categoryId", "name slug icon")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl")
      .sort(sort)
      .skip(skip)
      .limit(numericLimit),
    Listing.countDocuments(filter),
  ]);

  return {
    listings: listings.map(toPublicListingDTO),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / numericLimit),
      limit: numericLimit,
    },
  };
};

/**
 * Public Single Aggregated Listing Detail (1 single request)
 */
export const getPublicListingBySlug = async (slug) => {
  const listing = await Listing.findOne({
    slug: slug.toLowerCase().trim(),
    isLive: true,
  })
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price description isGlobal")
    .populate("media.mediaId", "secureUrl width height format");

  if (!listing) return null;
  return toPublicListingDTO(listing);
};

/**
 * Vendor: Get own listings
 */
export const getVendorListings = async (vendorId, query = {}) => {
  const { page = 1, limit = 20, status } = query;
  const filter = { vendorId };

  if (status) {
    filter.status = status;
  }

  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const numericLimit = Math.min(50, Math.max(1, Number(limit)));

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("categoryId", "name slug icon")
      .populate("media.mediaId", "secureUrl")
      .sort("-createdAt")
      .skip(skip)
      .limit(numericLimit),
    Listing.countDocuments(filter),
  ]);

  return {
    listings: listings.map(toVendorListingDTO),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / numericLimit),
      limit: numericLimit,
    },
  };
};

/**
 * Vendor: Create listing
 * Non-negotiable: forces status="pending_review", isLive=false
 */
export const createVendorListing = async (vendorId, data, user) => {
  let baseSlug = slugify(data.title || "coworking-space", {
    lower: true,
    strict: true,
  });
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await Listing.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const newListing = await Listing.create({
    ...data,
    vendorId,
    slug: uniqueSlug,
    status: "pending_review",
    isLive: false,
    rejectionReason: "",
    lastEditedBy: vendorId,
  });

  // Audit log
  await AuditLog.create({
    action: "listing_created",
    performedBy: vendorId,
    targetEmail: user?.email,
    metadata: {
      listingId: newListing._id,
      title: newListing.title,
      vendorId,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Realtime notification to admin room
  try {
    realtimeHub.broadcast("listings", "LISTING_SUBMITTED_FOR_REVIEW", {
      listingId: newListing._id.toString(),
      title: newListing.title,
      vendorId: vendorId.toString(),
      vendorEmail: user?.email,
      timestamp: Date.now(),
    });

    createNotification({
      title: `Listing Submitted: ${newListing.title}`,
      message: `${user?.businessName || user?.name || "Vendor Partner"} submitted workspace "${newListing.title}" for review.`,
      category: "listing",
      priority: "normal",
      actionUrl: "/admin/approvals",
      metadata: {
        listingId: newListing._id.toString(),
        title: newListing.title,
        vendorId: vendorId.toString(),
      },
    }).catch(() => {});
  } catch {}

  return toVendorListingDTO(newListing);
};

/**
 * Vendor: Update own listing
 * Non-negotiable: If already live, editing forces status="pending_review" and isLive=false
 */
export const updateVendorListing = async (listingId, vendorId, data, user) => {
  const listing = await Listing.findOne({ _id: listingId, vendorId });
  if (!listing) {
    throw new Error("Listing not found or access denied.");
  }

  const wasLive = listing.isLive;

  // Apply updates
  Object.assign(listing, data);
  listing.vendorId = vendorId; // ensure vendorId cannot be tampered
  listing.lastEditedBy = vendorId;

  // If it was live, demote to pending review
  if (wasLive) {
    listing.status = "pending_review";
    listing.isLive = false;
  }

  await listing.save();

  // Audit log
  await AuditLog.create({
    action: "listing_updated",
    performedBy: vendorId,
    targetEmail: user?.email,
    metadata: {
      listingId: listing._id,
      title: listing.title,
      demotedFromLive: wasLive,
    },
  }).catch((err) => console.error("Audit log error:", err));

  if (wasLive) {
    try {
      realtimeHub.broadcast("listings", "LISTING_SUBMITTED_FOR_REVIEW", {
        listingId: listing._id.toString(),
        title: listing.title,
        vendorId: vendorId.toString(),
        demotedFromLive: true,
        timestamp: Date.now(),
      });
    } catch {}
  }

  return toVendorListingDTO(listing);
};

/**
 * SuperAdmin: Get all listings
 */
export const getAdminListings = async (query = {}) => {
  const { page = 1, limit = 30, status, isLive, search } = query;
  const filter = {};

  if (status) filter.status = status;
  if (isLive !== undefined) filter.isLive = isLive === "true" || isLive === true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { "location.area": { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const numericLimit = Math.min(100, Math.max(1, Number(limit)));

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("vendorId", "fullName name email businessName phone")
      .populate("categoryId", "name slug icon")
      .populate("media.mediaId", "secureUrl")
      .sort("-createdAt")
      .skip(skip)
      .limit(numericLimit),
    Listing.countDocuments(filter),
  ]);

  return {
    listings: listings.map(toAdminListingDTO),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / numericLimit),
      limit: numericLimit,
    },
  };
};

/**
 * SuperAdmin: Trusted Edit on Listing (Keeps isLive unchanged)
 */
export const updateAdminListing = async (listingId, data, adminUser) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  Object.assign(listing, data);
  listing.lastEditedBy = adminUser._id;
  await listing.save();

  await AuditLog.create({
    action: "listing_updated",
    performedBy: adminUser._id,
    targetEmail: adminUser.email,
    metadata: {
      listingId: listing._id,
      title: listing.title,
      updatedBySuperAdmin: true,
    },
  }).catch((err) => console.error("Audit log error:", err));

  return toAdminListingDTO(listing);
};

/**
 * SuperAdmin: Exclusive Approve or Reject Listing
 */
export const reviewListingStatus = async (
  listingId,
  { status, rejectionReason = "" },
  adminUser
) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid review status. Must be 'approved' or 'rejected'.");
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  listing.status = status;
  listing.approvedBy = status === "approved" ? adminUser._id : null;
  listing.approvedAt = status === "approved" ? new Date() : null;
  listing.rejectionReason = status === "rejected" ? rejectionReason : "";

  // If rejected, ensure isLive is turned off
  if (status === "rejected") {
    listing.isLive = false;
  }

  await listing.save();

  // Audit log
  await AuditLog.create({
    action: status === "approved" ? "listing_approved" : "listing_rejected",
    performedBy: adminUser._id,
    targetEmail: adminUser.email,
    metadata: {
      listingId: listing._id,
      title: listing.title,
      vendorId: listing.vendorId,
      status,
      rejectionReason,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Realtime notification to all connected clients (Admin console, Vendor portal, Marketplace)
  try {
    realtimeHub.broadcast("listings", "LISTING_STATUS_CHANGED", {
      listingId: listing._id.toString(),
      title: listing.title,
      status,
      isLive: listing.isLive,
      rejectionReason,
      vendorId: listing.vendorId?.toString(),
      timestamp: Date.now(),
    });
  } catch {}

  return toAdminListingDTO(listing);
};

/**
 * SuperAdmin: Exclusive isLive Toggle
 */
export const toggleListingLive = async (listingId, isLive, adminUser) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  if (isLive && listing.status !== "approved") {
    throw new Error("Cannot set a listing to live before content approval.");
  }

  listing.isLive = Boolean(isLive);
  if (listing.isLive && !listing.publishedAt) {
    listing.publishedAt = new Date();
  }

  await listing.save();

  // Audit log
  await AuditLog.create({
    action: "listing_live_toggled",
    performedBy: adminUser._id,
    targetEmail: adminUser.email,
    metadata: {
      listingId: listing._id,
      title: listing.title,
      isLive: listing.isLive,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Realtime notification to all connected clients (Admin console, Vendor portal, Marketplace)
  try {
    realtimeHub.broadcast("listings", "LISTING_STATUS_CHANGED", {
      listingId: listing._id.toString(),
      title: listing.title,
      status: listing.status,
      isLive: listing.isLive,
      vendorId: listing.vendorId?.toString(),
      updatedBy: adminUser?.email,
      timestamp: Date.now(),
    });
  } catch {}

  return toAdminListingDTO(listing);
};

/**
 * SuperAdmin: Exclusive Delete Listing
 */
export const deleteListingByAdmin = async (listingId, adminUser) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  const deletedTitle = listing.title;
  const deletedVendorId = listing.vendorId;

  await Listing.findByIdAndDelete(listingId);

  // Audit log
  await AuditLog.create({
    action: "listing_deleted",
    performedBy: adminUser._id,
    targetEmail: adminUser.email,
    metadata: {
      listingId,
      title: deletedTitle,
      vendorId: deletedVendorId,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Realtime notification
  try {
    realtimeHub.broadcast("listings", "LISTING_DELETED", {
      listingId: listingId.toString(),
      title: deletedTitle,
      vendorId: deletedVendorId?.toString(),
      timestamp: Date.now(),
    });
  } catch {}

  return { success: true, message: `Listing '${deletedTitle}' deleted successfully.` };
};

/**
 * Vendor: Get single listing by ID
 */
export const getVendorListingById = async (listingId, vendorId) => {
  const listing = await Listing.findOne({ _id: listingId, vendorId })
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price description isGlobal")
    .populate("media.mediaId", "secureUrl width height format");

  if (!listing) {
    throw new Error("Listing not found or access denied.");
  }
  return toVendorListingDTO(listing);
};

/**
 * SuperAdmin: Get single listing by ID (full details)
 */
export const getAdminListingById = async (listingId) => {
  const listing = await Listing.findById(listingId)
    .populate("vendorId", "fullName name email businessName phone")
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price description isGlobal")
    .populate("media.mediaId", "secureUrl width height format");

  if (!listing) {
    throw new Error("Listing not found.");
  }
  return toAdminListingDTO(listing);
};

/**
 * SuperAdmin: Create listing directly
 */
export const createAdminListing = async (data, adminUser) => {
  let baseSlug = slugify(data.title || "coworking-space", {
    lower: true,
    strict: true,
  });
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await Listing.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const newListing = await Listing.create({
    ...data,
    vendorId: data.vendorId || adminUser._id,
    slug: uniqueSlug,
    status: data.status || "approved",
    isLive: data.isLive !== undefined ? Boolean(data.isLive) : true,
    lastEditedBy: adminUser._id,
    approvedBy: adminUser._id,
    approvedAt: new Date(),
  });

  await AuditLog.create({
    action: "listing_created",
    performedBy: adminUser._id,
    targetEmail: adminUser.email,
    metadata: {
      listingId: newListing._id,
      title: newListing.title,
      createdDirectlyByAdmin: true,
    },
  }).catch((err) => console.error("Audit log error:", err));

  return toAdminListingDTO(newListing);
};

/**
 * Vendor: Analytics
 */
export const getVendorAnalytics = async (vendorId) => {
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

  const [totalListings, liveListings, pendingListings, totalServices] =
    await Promise.all([
      Listing.countDocuments({ vendorId: vendorObjectId }),
      Listing.countDocuments({ vendorId: vendorObjectId, isLive: true }),
      Listing.countDocuments({ vendorId: vendorObjectId, status: "pending_review" }),
      Service.countDocuments({
        $or: [{ vendorId: vendorObjectId }, { isGlobal: true }],
        isActive: true,
      }).catch(() => 0),
    ]);

  const recentListings = await Listing.find({ vendorId: vendorObjectId })
    .populate("categoryId", "name")
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  return {
    stats: {
      totalListings,
      liveListings,
      pendingListings,
      totalServices,
    },
    recentListings,
  };
};
