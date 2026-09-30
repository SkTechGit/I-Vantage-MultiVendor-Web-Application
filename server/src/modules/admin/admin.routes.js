import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import * as adminController from "./admin.controller.js";
import * as listingController from "../listings/listing.controller.js";
import * as serviceController from "../marketplace-services/service.controller.js";
import * as leadController from "../marketplace-leads/lead.controller.js";
import * as amenityController from "../amenities/amenity.controller.js";
import * as categoryController from "../marketplace-categories/category.controller.js";

const router = Router();
const adminAuth = [authenticate, authorize(["super_admin"])];
const superAdminOnly = [authenticate, authorize(["super_admin"])];

/* -------------------------------------------------------------------------- */
/*                               Dashboard & Analytics                        */
/* -------------------------------------------------------------------------- */
router.get("/dashboard", adminAuth, adminController.getDashboardStats);
router.get("/analytics", adminAuth, adminController.getAdminAnalytics);

/* -------------------------------------------------------------------------- */
/*                               Vendors Management                           */
/* -------------------------------------------------------------------------- */
router.get("/vendors", adminAuth, adminController.getVendors);
router.patch("/vendors/:id/status", superAdminOnly, adminController.updateVendorStatus);
router.patch("/vendors/:id/role", superAdminOnly, adminController.updateVendorRole);
router.delete("/vendors/:id", superAdminOnly, adminController.deleteVendor);
router.get("/users", adminAuth, adminController.getAllPlatformUsers);
router.get("/audit-logs", adminAuth, adminController.getAuditLogs);

/* -------------------------------------------------------------------------- */
/*                               Listings Management                          */
/* -------------------------------------------------------------------------- */
router.get("/listings", adminAuth, listingController.getAdminListings);
router.get("/listings/:id", adminAuth, listingController.getAdminListingById);
router.post("/listings", adminAuth, listingController.createAdminListing);
router.patch("/listings/:id", adminAuth, listingController.updateAdminListing);
router.patch("/listings/:id/approve", superAdminOnly, listingController.reviewListingStatus);
router.patch("/listings/:id/live", superAdminOnly, listingController.toggleListingLive);
router.delete("/listings/:id", superAdminOnly, listingController.deleteListingByAdmin);

/* -------------------------------------------------------------------------- */
/*                               Services Management                          */
/* -------------------------------------------------------------------------- */
router.get("/services", adminAuth, serviceController.getAdminServices);
router.post("/services", adminAuth, serviceController.createAdminService);
router.patch("/services/:id", adminAuth, serviceController.updateAdminService);
router.delete("/services/:id", superAdminOnly, serviceController.deleteAdminService);

/* -------------------------------------------------------------------------- */
/*                                Leads Management                            */
/* -------------------------------------------------------------------------- */
router.get("/leads", adminAuth, leadController.getAdminLeads);
router.patch("/leads/:id", adminAuth, leadController.updateAdminLead);
router.delete("/leads/:id", superAdminOnly, leadController.deleteAdminLead);

/* -------------------------------------------------------------------------- */
/*                               Amenities Management                         */
/* -------------------------------------------------------------------------- */
router.get("/amenities", adminAuth, amenityController.getAllAmenitiesAdmin);
router.post("/amenities", superAdminOnly, amenityController.createAmenity);
router.patch("/amenities/:id", superAdminOnly, amenityController.updateAmenity);
router.delete("/amenities/:id", superAdminOnly, amenityController.deleteAmenity);

/* -------------------------------------------------------------------------- */
/*                              Categories Management                         */
/* -------------------------------------------------------------------------- */
router.get("/categories", adminAuth, categoryController.getAllMarketplaceCategoriesAdmin);
router.post("/categories", superAdminOnly, categoryController.createMarketplaceCategory);
router.patch("/categories/:id", superAdminOnly, categoryController.updateMarketplaceCategory);
router.delete("/categories/:id", superAdminOnly, categoryController.deleteMarketplaceCategory);

export default router;