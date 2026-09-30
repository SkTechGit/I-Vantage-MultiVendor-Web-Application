import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import * as notificationController from "./notification.controller.js";

const router = Router();
const adminAuth = [authenticate, authorize(["super_admin", "admin"])];

router.get("/", adminAuth, notificationController.getNotifications);
router.patch("/:id/read", adminAuth, notificationController.markAsRead);
router.post("/mark-all-read", adminAuth, notificationController.markAllAsRead);
router.delete("/:id", adminAuth, notificationController.deleteNotification);
router.delete("/", adminAuth, notificationController.clearAllNotifications);

export default router;
