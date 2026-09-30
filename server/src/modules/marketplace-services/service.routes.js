import { Router } from "express";
import * as serviceController from "./service.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();
const vendorAuth = [authenticate, authorize(["vendor", "super_admin"])];
const adminAuth = [authenticate, authorize(["super_admin"])];

/* Vendor */
router.get("/vendor", vendorAuth, serviceController.getVendorServices);
router.post("/vendor", vendorAuth, serviceController.createVendorService);
router.patch("/vendor/:id", vendorAuth, serviceController.updateVendorService);
router.delete("/vendor/:id", vendorAuth, serviceController.deleteVendorService);

/* Admin */
router.get("/admin", adminAuth, serviceController.getAdminServices);
router.post("/admin", adminAuth, serviceController.createAdminService);
router.patch("/admin/:id", adminAuth, serviceController.updateAdminService);
router.delete("/admin/:id", adminAuth, serviceController.deleteAdminService);

export default router;
