import { Router } from "express";
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,

  updateLeadStatus,
  addLeadNote,
  addFollowUp,
  completeFollowUp,

} from "./lead.controller.js";

import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();

/* Public */
router.post("/", createLead);

/* Admin & SuperAdmin Only - Strict Role Isolation */
router.get("/", authenticate, authorize(["super_admin", "admin"]), getAllLeads);
router.get("/:id", authenticate, authorize(["super_admin", "admin"]), getLeadById);
router.patch("/:id", authenticate, authorize(["super_admin", "admin"]), updateLead);
router.patch(
  "/:id/status",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateLeadStatus
);

router.post(
  "/:id/notes",
  authenticate,
  authorize(["super_admin", "admin"]),
  addLeadNote
);

router.post(
  "/:id/follow-ups",
  authenticate,
  authorize(["super_admin", "admin"]),
  addFollowUp
);

router.patch(
  "/:id/follow-ups/:followUpId",
  authenticate,
  authorize(["super_admin", "admin"]),
  completeFollowUp
);
router.delete("/:id", authenticate, authorize(["super_admin", "admin"]), deleteLead);

export default router;