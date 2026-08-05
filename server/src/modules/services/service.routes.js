import { Router } from "express";
import * as controller from "./service.controller.js";
import { authenticate } from "../auth/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", controller.getAllServices);
router.get("/search", controller.searchServices);
router.get(
  "/category/:slug",
  controller.getServicesByCategory
);
router.get("/:id", controller.getServiceById);




router.post(
  "/",
  authenticate,
  upload.single("image"),
  controller.createService
);

router.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  controller.updateService
);

router.delete("/:id", authenticate, controller.deleteService);

export default router;