import { Router } from "express";
import * as amenityController from "./amenity.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();
const adminAuth = [authenticate, authorize(["super_admin"])];

router.get("/", amenityController.getAmenities);
router.get("/admin", adminAuth, amenityController.getAllAmenitiesAdmin);
router.post("/admin", adminAuth, amenityController.createAmenity);
router.patch("/admin/:id", adminAuth, amenityController.updateAmenity);
router.delete("/admin/:id", adminAuth, amenityController.deleteAmenity);

export default router;
