import { Router } from "express";

import { authenticate } from "../auth/auth.middleware.js";

import * as adminController from "./admin.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  adminController.getDashboardStats
);

export default router;