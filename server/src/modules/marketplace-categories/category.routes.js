import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();
const adminAuth = [authenticate, authorize(["super_admin"])];

router.get("/", categoryController.getMarketplaceCategories);
router.get("/admin", adminAuth, categoryController.getAllMarketplaceCategoriesAdmin);
router.post("/admin", adminAuth, categoryController.createMarketplaceCategory);
router.patch("/admin/:id", adminAuth, categoryController.updateMarketplaceCategory);
router.delete("/admin/:id", adminAuth, categoryController.deleteMarketplaceCategory);

export default router;
