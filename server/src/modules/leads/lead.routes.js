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

import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

/* Public */
router.post("/", createLead);

/* Admin */
router.get("/", authenticate, getAllLeads);
router.get("/:id", authenticate, getLeadById);
router.patch("/:id", authenticate, updateLead);
router.patch(
  "/:id/status",
  authenticate,
  updateLeadStatus
);

router.post(
  "/:id/notes",
  authenticate,
  addLeadNote
);

router.post(
  "/:id/follow-ups",
  authenticate,
  addFollowUp
);

router.patch(
  "/:id/follow-ups/:followUpId",
  authenticate,
  completeFollowUp
);
router.delete("/:id", authenticate, deleteLead);

export default router;