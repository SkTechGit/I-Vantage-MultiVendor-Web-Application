import { Router } from "express";

import { authenticate, authorize } from "../auth/auth.middleware.js";

import * as crmController from "./crm.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin"]),
  crmController.getCRMLeads
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin"]),
  crmController.getCRMLead
);

router.patch(
  "/:id",
  authenticate,
  authorize(["super_admin"]),
  crmController.updateCRMLead
);

export default router;