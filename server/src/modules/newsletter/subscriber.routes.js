import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
} from "./subscriber.controller.js";

const router = Router();
const superAdminOnly = [authenticate, authorize(["super_admin"])];

// Public endpoints
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin-only management endpoint
router.get("/subscribers", superAdminOnly, getSubscribers);

export default router;
