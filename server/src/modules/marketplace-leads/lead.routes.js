import { Router } from "express";
import * as leadController from "./lead.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();
const vendorAuth = [authenticate, authorize(["vendor", "super_admin"])];
const adminAuth = [authenticate, authorize(["super_admin"])];

/* Public enquiry */
router.post("/", leadController.createLead);

/* Vendor */
router.get("/vendor", vendorAuth, leadController.getVendorLeads);
router.patch("/vendor/:id", vendorAuth, leadController.updateVendorLead);

/* Admin */
router.get("/admin", adminAuth, leadController.getAdminLeads);
router.patch("/admin/:id", adminAuth, leadController.updateAdminLead);
router.delete("/admin/:id", adminAuth, leadController.deleteAdminLead);

export default router;
