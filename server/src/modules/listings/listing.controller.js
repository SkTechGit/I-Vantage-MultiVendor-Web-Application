import * as listingService from "./listing.service.js";

/**
 * Public: GET /api/v1/listings
 */
export const getPublicListings = async (req, res, next) => {
  try {
    const result = await listingService.getPublicListings(req.query);
    res.status(200).json({
      success: true,
      data: result.listings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: GET /api/v1/listings/:slug
 */
export const getPublicListingBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const listing = await listingService.getPublicListingBySlug(slug);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or is currently not available.",
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: GET /api/v1/vendor/listings
 */
export const getVendorListings = async (req, res, next) => {
  try {
    const result = await listingService.getVendorListings(
      req.user._id,
      req.query
    );
    res.status(200).json({
      success: true,
      data: result.listings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: POST /api/v1/vendor/listings
 */
export const createVendorListing = async (req, res, next) => {
  try {
    const listing = await listingService.createVendorListing(
      req.user._id,
      req.body,
      req.user
    );
    res.status(201).json({
      success: true,
      message: "Listing submitted successfully. Awaiting administrator review.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: PATCH /api/v1/vendor/listings/:id
 */
export const updateVendorListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.updateVendorListing(
      id,
      req.user._id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: GET /api/v1/admin/listings
 */
export const getAdminListings = async (req, res, next) => {
  try {
    const result = await listingService.getAdminListings(req.query);
    res.status(200).json({
      success: true,
      data: result.listings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: PATCH /api/v1/admin/listings/:id
 */
export const updateAdminListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.updateAdminListing(
      id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Listing updated successfully by administrator.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: PATCH /api/v1/admin/listings/:id/approve
 */
export const reviewListingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.reviewListingStatus(
      id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: `Listing status updated to ${listing.status}.`,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: PATCH /api/v1/admin/listings/:id/live
 */
export const toggleListingLive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isLive } = req.body;
    const listing = await listingService.toggleListingLive(
      id,
      isLive,
      req.user
    );
    res.status(200).json({
      success: true,
      message: `Listing is now ${listing.isLive ? "LIVE on marketplace" : "OFFLINE"}.`,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: DELETE /api/v1/admin/listings/:id
 */
export const deleteListingByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await listingService.deleteListingByAdmin(id, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: GET /api/v1/vendor/listings/:id
 */
export const getVendorListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.getVendorListingById(id, req.user._id);
    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: GET /api/v1/admin/listings/:id
 */
export const getAdminListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.getAdminListingById(id);
    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: POST /api/v1/admin/listings
 */
export const createAdminListing = async (req, res, next) => {
  try {
    const listing = await listingService.createAdminListing(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Listing created successfully.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: GET /api/v1/vendor/analytics
 */
export const getVendorAnalytics = async (req, res, next) => {
  try {
    const data = await listingService.getVendorAnalytics(req.user._id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
