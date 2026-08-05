import { Router } from "express";

import { authenticate } from "../auth/auth.middleware.js";

import * as crmController from "./crm.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  crmController.getCRMLeads
);

router.get(
  "/:id",
  authenticate,
  crmController.getCRMLead
);

router.patch(
  "/:id",
  authenticate,
  crmController.updateCRMLead
);

export default router;