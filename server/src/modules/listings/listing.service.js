import mongoose from "mongoose";
import Listing from "./listing.model.js";
import MarketplaceCategory from "../marketplace-categories/category.model.js";
import Service from "../marketplace-services/service.model.js";
import { inferServiceUnit } from "../marketplace-services/service.controller.js";
import AuditLog from "../auth/audit-log.model.js";
import realtimeHub from "../realtime/realtime.hub.js";
import slugify from "slugify";
import User from "../users/user.model.js";
import Auth from "../auth/auth.model.js";
import { createNotification } from "../notifications/notification.service.js";
import {
  sendListingSubmissionNotifications,
  sendListingReviewDecisionNotifications,
} from "../../utils/email.js";

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

  const formattedServices = (l.serviceIds || []).map((s) => {
    if (
      !s ||
      typeof s !== "object" ||
      s instanceof mongoose.Types.ObjectId ||
      s._bsontype === "ObjectID" ||
      !s.name
    ) {
      return s?._id?.toString() || s?.toString?.() || s;
    }
    const sObj = s.toObject ? s.toObject() : s;
    const unit = sObj.unit || inferServiceUnit(sObj.name, l.categoryId?.name);
    return {
      ...sObj,
      _id: sObj._id?.toString?.() || sObj._id,
      id: sObj._id?.toString?.() || sObj.id,
      unit,
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
    services: formattedServices,
    serviceIds: formattedServices,
    amenities: l.amenityIds || [],
    amenityIds: l.amenityIds || [],
    customAmenities: l.customAmenities || [],
    media: mediaList,
    status: l.status,
    isLive: l.isLive,
    legacySlugs: l.legacySlugs || [],
    publishedAt: l.publishedAt,
    createdAt: l.createdAt,
    vendorId: {
      _id: l.vendorId?._id?.toString() || l.vendorId?.toString?.() || l.vendorId,
      name: l.vendorId?.businessName || l.vendorId?.name || l.vendorId?.fullName || "Verified Partner",
      businessName: l.vendorId?.businessName || l.vendorId?.name || "i-VANTAGE Verified Partner",
      email: l.vendorId?.email || "",
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

  const formattedServices = (l.serviceIds || []).map((s) => {
    if (
      !s ||
      typeof s !== "object" ||
      s instanceof mongoose.Types.ObjectId ||
      s._bsontype === "ObjectID" ||
      !s.name
    ) {
      return s?._id?.toString() || s?.toString?.() || s;
    }
    const sObj = s.toObject ? s.toObject() : s;
    const unit = sObj.unit || inferServiceUnit(sObj.name, l.categoryId?.name);
    return {
      ...sObj,
      _id: sObj._id?.toString?.() || sObj._id,
      id: sObj._id?.toString?.() || sObj.id,
      unit,
    };
  });

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
    serviceIds: formattedServices,
    amenityIds: l.amenityIds || [],
    customAmenities: l.customAmenities || [],
    media: l.media || [],
    status: l.status,
    isLive: l.isLive,
    legacySlugs: l.legacySlugs || [],
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

  // Normalize vendor details for accurate display across Admin tables
  const rawVendor = l.vendorId;
  let formattedVendor = null;

  if (rawVendor && typeof rawVendor === "object") {
    formattedVendor = {
      _id: rawVendor._id?.toString() || rawVendor.id?.toString(),
      id: rawVendor._id?.toString() || rawVendor.id?.toString(),
      name: rawVendor.businessName || rawVendor.name || rawVendor.fullName || "Verified Coworking Partner",
      fullName: rawVendor.fullName || rawVendor.name || "Verified Coworking Partner",
      businessName: rawVendor.businessName || rawVendor.name || rawVendor.fullName || "Verified Coworking Partner",
      email: rawVendor.email || "",
      phone: rawVendor.phone || "",
    };
  }

  return {
    ...l,
    _id: idStr,
    id: idStr,
    vendorId: formattedVendor || l.vendorId,
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
    search,
    q,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = query;

  const filter = { isLive: true, status: "approved" };

  const searchQuery = (search || q || "").trim();
  if (searchQuery) {
    const s = searchQuery;
    filter.$or = [
      { title: { $regex: s, $options: "i" } },
      { slug: { $regex: s, $options: "i" } },
      { "location.city": { $regex: s, $options: "i" } },
      { "location.area": { $regex: s, $options: "i" } },
      { "location.address": { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
    ];

    const num = Number(s.replace(/[^0-9]/g, ""));
    if (!isNaN(num) && num > 0) {
      filter.$or.push({ "pricing.basePrice": num });
    }

    // Also match listings whose vendor name or email matches the search query
    try {
      const [matchedUsers, matchedAuths] = await Promise.all([
        User.find({
          $or: [
            { fullName: { $regex: s, $options: "i" } },
            { name: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
            { businessName: { $regex: s, $options: "i" } },
          ],
        }).select("_id"),
        Auth.find({
          $or: [
            { name: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
          ],
        }).select("_id"),
      ]);
      const userIds = [
        ...matchedUsers.map((u) => u._id),
        ...matchedAuths.map((a) => a._id),
      ];
      if (userIds.length > 0) {
        filter.$or.push({ vendorId: { $in: userIds } });
      }
    } catch (_) {}
  }

  if (city) {
    filter["location.city"] = { $regex: new RegExp(`^${city.trim()}$`, "i") };
  }

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.categoryId = category;
    } else {
      const catDoc = await MarketplaceCategory.findOne({
        $or: [
          { slug: category.toLowerCase().trim() },
          { name: new RegExp(`^${category.trim()}$`, "i") },
        ],
      }).select("_id");
      if (catDoc) {
        filter.categoryId = catDoc._id;
      } else {
        filter.categoryId = null;
      }
    }
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

  const [rawListings, total] = await Promise.all([
    Listing.find(filter)
      .populate("vendorId", "businessName name fullName")
      .populate("categoryId", "name slug icon")
      .populate("amenityIds", "name icon")
      .populate("media.mediaId", "secureUrl")
      .sort(sort)
      .skip(skip)
      .limit(numericLimit),
    Listing.countDocuments(filter),
  ]);

  const listings = await attachVendorDetails(rawListings);

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
  const clean = String(slug).toLowerCase().trim();
  const query = {
    $or: [
      { slug: clean },
      { legacySlugs: clean },
      ...(mongoose.Types.ObjectId.isValid(slug) ? [{ _id: slug }] : []),
    ],
    isLive: true,
  };

  const rawListing = await Listing.findOne(query)
    .populate("vendorId", "businessName name fullName email")
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price unit description isGlobal")
    .populate("media.mediaId", "secureUrl width height format");

  if (!rawListing) return null;
  const [listing] = await attachVendorDetails([rawListing]);
  return toPublicListingDTO(listing);
};

/**
 * Resolves all associated ObjectIds for a vendor account
 * Gracefully bridges dual collections (Marketplace User & Auth collections)
 */
export const resolveVendorIds = async (vendorId, userObj = null) => {
  const ids = new Set();
  if (vendorId) {
    if (mongoose.Types.ObjectId.isValid(vendorId)) {
      ids.add(new mongoose.Types.ObjectId(vendorId));
    } else {
      ids.add(vendorId);
    }
  }

  let email = userObj?.email;
  if (!email && vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
    const [u, a] = await Promise.all([
      User.findById(vendorId).select("email").lean(),
      Auth.findById(vendorId).select("email").lean(),
    ]);
    email = u?.email || a?.email;
  }

  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    const [uList, aList] = await Promise.all([
      User.find({ email: normalizedEmail }).select("_id").lean(),
      Auth.find({ email: normalizedEmail }).select("_id").lean(),
    ]);
    uList.forEach((item) => ids.add(item._id));
    aList.forEach((item) => ids.add(item._id));
  }

  return Array.from(ids);
};

/**
 * Vendor: Get own listings
 */
export const getVendorListings = async (vendorId, query = {}, user = null) => {
  const { page = 1, limit = 100, status, search } = query;
  const vendorIds = await resolveVendorIds(vendorId, user);
  const filter = {
    vendorId: vendorIds.length > 1 ? { $in: vendorIds } : vendorIds[0] || vendorId,
  };

  if (status && status !== "all") {
    filter.status = status;
  }

  if (search && String(search).trim()) {
    const s = String(search).trim();
    filter.$or = [
      { title: { $regex: s, $options: "i" } },
      { "location.city": { $regex: s, $options: "i" } },
      { "location.area": { $regex: s, $options: "i" } },
    ];
  }

  const numericPage = Math.max(1, Number(page) || 1);
  const requestedLimit = Number(limit);
  // Default to 100 listings so vendors can view all properties smoothly without cutoffs, maximum 500
  const numericLimit = requestedLimit > 0 ? Math.min(500, requestedLimit) : 100;
  const skip = (numericPage - 1) * numericLimit;

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
      page: numericPage,
      pages: Math.ceil(total / numericLimit) || 1,
      limit: numericLimit,
    },
  };
};

/**
 * Clean & Concise Slug Generator for Listings
 * Removes pipe delimiters, dashes, duplicates, and keeps SEO-friendly keywords <= 55 chars
 */
export const generateCleanListingSlug = (title) => {
  let clean = String(title || "workspace")
    .replace(/\|/g, " ")
    .replace(/[—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Deduplicate repeating tokens
  const words = clean.split(" ");
  const uniqueWords = [];
  const seen = new Set();
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (key.length > 2 && seen.has(key)) continue;
    if (key.length > 2) seen.add(key);
    uniqueWords.push(w);
  }
  clean = uniqueWords.join(" ");

  let s = slugify(clean, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@|]/g,
  });

  if (s.length > 55) {
    s = s.substring(0, 55).replace(/-[^-]*$/, "");
  }
  return s || "workspace";
};

/**
 * Vendor: Create listing
 * Non-negotiable: forces status="pending_review", isLive=false
 */
export const createVendorListing = async (vendorId, data, user) => {
  let baseSlug = generateCleanListingSlug(data.title || "coworking-space");
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

  // Send email alerts: SuperAdmins notified of new listing + Vendor receives receipt confirmation
  const startingPrice = newListing.pricing?.startingPrice || newListing.pricing?.coworkingDedicatedDeskPrice || newListing.pricing?.coworkingHotDeskPrice;
  sendListingSubmissionNotifications({
    listingTitle: newListing.title,
    city: newListing.location?.city || "Gurugram",
    price: startingPrice,
    vendorBusinessName: user?.businessName || user?.name || "Vendor Partner",
    vendorEmail: user?.email,
  }).catch((mailErr) => console.error("Listing submission email error:", mailErr.message));

  await newListing.populate([
    { path: "categoryId", select: "name slug icon" },
    { path: "serviceIds", select: "name size price unit description isGlobal" },
    { path: "amenityIds", select: "name icon" },
    { path: "media.mediaId", select: "secureUrl width height format" },
  ]);

  return toVendorListingDTO(newListing);
};

/**
 * Vendor: Update own listing
 * Non-negotiable: If already live, editing forces status="pending_review" and isLive=false
 */
export const updateVendorListing = async (listingId, vendorId, data, user = null) => {
  const vendorIds = await resolveVendorIds(vendorId, user);
  const listing = await Listing.findOne({
    _id: listingId,
    vendorId: vendorIds.length > 1 ? { $in: vendorIds } : vendorIds[0] || vendorId,
  });
  if (!listing) {
    throw new Error("Listing not found or access denied.");
  }

  const wasLive = listing.isLive;

  // Apply updates
  Object.assign(listing, data);
  if (!listing.vendorId || !vendorIds.some((vId) => vId.toString() === listing.vendorId.toString())) {
    listing.vendorId = vendorId;
  }
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

  await listing.populate([
    { path: "categoryId", select: "name slug icon" },
    { path: "serviceIds", select: "name size price unit description isGlobal" },
    { path: "amenityIds", select: "name icon" },
    { path: "media.mediaId", select: "secureUrl width height format" },
  ]);

  return toVendorListingDTO(listing);
};

/**
 * Ensures vendor details (name, businessName, email, phone) are accurately resolved
 * across MarketplaceUser and Auth collections for all listings.
 */
export const attachVendorDetails = async (listings) => {
  if (!listings || !listings.length) return listings;

  const missingVendorIds = [];
  for (const l of listings) {
    const v = l.vendorId;
    if (
      !v ||
      mongoose.Types.ObjectId.isValid(v) ||
      typeof v === "string" ||
      (!v.businessName && !v.name && !v.fullName)
    ) {
      const rawId = v?._id || v;
      if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
        missingVendorIds.push(new mongoose.Types.ObjectId(rawId));
      }
    }
  }

  if (missingVendorIds.length > 0) {
    const [mUsers, aUsers] = await Promise.all([
      User.find({ _id: { $in: missingVendorIds } }).select("fullName name email businessName phone").lean(),
      Auth.find({ _id: { $in: missingVendorIds } }).select("fullName name email businessName phone").lean(),
    ]);

    const vendorMap = new Map();
    for (const u of aUsers) {
      vendorMap.set(u._id.toString(), {
        _id: u._id.toString(),
        id: u._id.toString(),
        name: u.businessName || u.fullName || u.name || "Verified Coworking Partner",
        fullName: u.fullName || u.name || "Verified Coworking Partner",
        businessName: u.businessName || u.fullName || u.name || "Verified Coworking Partner",
        email: u.email || "",
        phone: u.phone || "",
      });
    }
    for (const u of mUsers) {
      vendorMap.set(u._id.toString(), {
        _id: u._id.toString(),
        id: u._id.toString(),
        name: u.businessName || u.name || u.fullName || "Verified Coworking Partner",
        fullName: u.name || u.fullName || "Verified Coworking Partner",
        businessName: u.businessName || u.name || u.fullName || "Verified Coworking Partner",
        email: u.email || "",
        phone: u.phone || "",
      });
    }

    for (const l of listings) {
      const rawId = (l.vendorId?._id || l.vendorId)?.toString();
      if (rawId && vendorMap.has(rawId)) {
        l.vendorId = vendorMap.get(rawId);
      }
    }
  }

  return listings;
};

/**
 * SuperAdmin: Get all listings
 */
export const getAdminListings = async (query = {}) => {
  const { page = 1, limit = 100, status, isLive, search } = query;
  const filter = {};

  if (status && status !== "all") filter.status = status;
  if (isLive !== undefined && isLive !== "") filter.isLive = isLive === "true" || isLive === true;

  if (search && String(search).trim()) {
    const s = String(search).trim();
    filter.$or = [
      { title: { $regex: s, $options: "i" } },
      { slug: { $regex: s, $options: "i" } },
      { "location.city": { $regex: s, $options: "i" } },
      { "location.area": { $regex: s, $options: "i" } },
      { "location.address": { $regex: s, $options: "i" } },
    ];

    const num = Number(s.replace(/[^0-9]/g, ""));
    if (!isNaN(num) && num > 0) {
      filter.$or.push({ "pricing.basePrice": num });
    }

    // Also match listings whose vendor name or email matches the search query
    try {
      const [matchedUsers, matchedAuths] = await Promise.all([
        User.find({
          $or: [
            { name: { $regex: s, $options: "i" } },
            { businessName: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
          ],
        }).select("_id").lean(),
        Auth.find({
          $or: [
            { fullName: { $regex: s, $options: "i" } },
            { name: { $regex: s, $options: "i" } },
            { businessName: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
          ],
        }).select("_id").lean(),
      ]);
      const matchedVendorIds = [
        ...matchedUsers.map((u) => u._id),
        ...matchedAuths.map((a) => a._id),
      ];
      if (matchedVendorIds.length > 0) {
        filter.$or.push({ vendorId: { $in: matchedVendorIds } });
      }
    } catch {}
  }

  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const numericLimit = Math.min(200, Math.max(1, Number(limit)));

  const [rawListings, total] = await Promise.all([
    Listing.find(filter)
      .populate("vendorId", "fullName name email businessName phone")
      .populate("categoryId", "name slug icon")
      .populate("media.mediaId", "secureUrl")
      .populate("serviceIds", "name price unit size")
      .sort("-createdAt")
      .skip(skip)
      .limit(numericLimit),
    Listing.countDocuments(filter),
  ]);

  const listings = await attachVendorDetails(rawListings);

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

  // Asynchronously notify vendor of approval/rejection decision
  User.findById(listing.vendorId)
    .select("email name businessName")
    .then((vendorUser) => {
      if (vendorUser && vendorUser.email) {
        sendListingReviewDecisionNotifications({
          listingTitle: listing.title,
          vendorEmail: vendorUser.email,
          status,
          rejectionReason,
          liveUrl: listing.slug ? `https://i-vantage.in/spaces/${listing.slug}` : "",
        }).catch((err) => console.error("Listing review decision mail error:", err.message));
      }
    })
    .catch((err) => console.error("Vendor lookup error for review email:", err.message));

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
export const getVendorListingById = async (listingId, vendorId, user = null) => {
  const vendorIds = await resolveVendorIds(vendorId, user);
  const listing = await Listing.findOne({
    _id: listingId,
    vendorId: vendorIds.length > 1 ? { $in: vendorIds } : vendorIds[0] || vendorId,
  })
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price unit description isGlobal")
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
  const rawListing = await Listing.findById(listingId)
    .populate("vendorId", "fullName name email businessName phone")
    .populate("categoryId", "name slug icon")
    .populate("amenityIds", "name icon")
    .populate("serviceIds", "name size price unit description isGlobal")
    .populate("media.mediaId", "secureUrl width height format");

  if (!rawListing) {
    throw new Error("Listing not found.");
  }
  const [listing] = await attachVendorDetails([rawListing]);
  return toAdminListingDTO(listing);
};

/**
 * SuperAdmin: Create listing directly
 */
export const createAdminListing = async (data, adminUser) => {
  let baseSlug = generateCleanListingSlug(data.title || "coworking-space");
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
export const getVendorAnalytics = async (vendorId, user = null) => {
  const vendorIds = await resolveVendorIds(vendorId, user);
  const vendorFilter = vendorIds.length > 1 ? { $in: vendorIds } : vendorIds[0] || vendorId;

  const [totalListings, liveListings, pendingListings, totalServices] =
    await Promise.all([
      Listing.countDocuments({ vendorId: vendorFilter }),
      Listing.countDocuments({ vendorId: vendorFilter, isLive: true }),
      Listing.countDocuments({ vendorId: vendorFilter, status: "pending_review" }),
      Service.countDocuments({
        $or: [{ vendorId: vendorFilter }, { isGlobal: true }],
        isActive: true,
      }).catch(() => 0),
    ]);

  const recentListings = await Listing.find({ vendorId: vendorFilter })
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
