import { Router } from "express";
import * as listingController from "./listing.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();

const vendorAuth = [authenticate, authorize(["vendor", "super_admin"])];
const adminAuth = [authenticate, authorize(["super_admin"])];

/* -------------------------------------------------------------------------- */
/*                                Public Routes                               */
/* -------------------------------------------------------------------------- */
router.get("/", listingController.getPublicListings);
router.get("/:slug", listingController.getPublicListingBySlug);

/* -------------------------------------------------------------------------- */
/*                                Vendor Routes                               */
/* -------------------------------------------------------------------------- */
router.get("/vendor/my", vendorAuth, listingController.getVendorListings);
router.post("/vendor/create", vendorAuth, listingController.createVendorListing);
router.patch("/vendor/:id", vendorAuth, listingController.updateVendorListing);

/* -------------------------------------------------------------------------- */
/*                              SuperAdmin Routes                             */
/* -------------------------------------------------------------------------- */
router.get("/admin/all", adminAuth, listingController.getAdminListings);
router.patch("/admin/:id", adminAuth, listingController.updateAdminListing);
router.patch("/admin/:id/approve", adminAuth, listingController.reviewListingStatus);
router.patch("/admin/:id/live", adminAuth, listingController.toggleListingLive);
router.delete("/admin/:id", adminAuth, listingController.deleteListingByAdmin);

export default router;
