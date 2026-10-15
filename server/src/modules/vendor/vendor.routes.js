import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import * as listingController from "../listings/listing.controller.js";
import * as serviceController from "../marketplace-services/service.controller.js";
import * as leadController from "../marketplace-leads/lead.controller.js";

const router = Router();
const vendorAuth = [authenticate, authorize(["vendor"])];

/* -------------------------------------------------------------------------- */
/*                               Vendor Listings                              */
/* -------------------------------------------------------------------------- */
router.get("/listings", vendorAuth, listingController.getVendorListings);
router.get("/listings/:id", vendorAuth, listingController.getVendorListingById);
router.post("/listings", vendorAuth, listingController.createVendorListing);
router.patch("/listings/:id", vendorAuth, listingController.updateVendorListing);

/* -------------------------------------------------------------------------- */
/*                               Vendor Services                              */
/* -------------------------------------------------------------------------- */
router.get("/services", vendorAuth, serviceController.getVendorServices);
router.post("/services", vendorAuth, serviceController.createVendorService);
router.patch("/services/:id", vendorAuth, serviceController.updateVendorService);
router.delete("/services/:id", vendorAuth, serviceController.deleteVendorService);

/* -------------------------------------------------------------------------- */
/*                 Vendor Leads (Restricted Exclusively to Admin)             */
/* -------------------------------------------------------------------------- */
const superAdminAuth = [authenticate, authorize(["super_admin"])];
router.get("/leads", superAdminAuth, leadController.getVendorLeads);
router.patch("/leads/:id", superAdminAuth, leadController.updateVendorLead);

/* -------------------------------------------------------------------------- */
/*                              Vendor Analytics                              */
/* -------------------------------------------------------------------------- */
router.get("/analytics", vendorAuth, listingController.getVendorAnalytics);

export default router;
