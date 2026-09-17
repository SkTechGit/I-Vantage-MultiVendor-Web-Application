import { Router } from "express";
import {
  login,
  signup,
  validateInvitation,
  logout,
  refreshTokenHandler,
  me,
  createInvitation,
  getInvitations,
  revokeInvitation,
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  getTeamMembers,
} from "./auth.controller.js";
import { authenticate, authorize } from "./auth.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Public Routes                               */
/* -------------------------------------------------------------------------- */

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh-token", refreshTokenHandler);
router.post("/refresh", refreshTokenHandler);
router.get("/invitation/validate", validateInvitation);
router.post("/logout", logout);

/* -------------------------------------------------------------------------- */
/*                            Authenticated Routes                            */
/* -------------------------------------------------------------------------- */

router.get("/me", authenticate, me);

/* -------------------------------------------------------------------------- */
/*                      Admin Team Management Routes                          */
/* -------------------------------------------------------------------------- */

// Only super_admin and admin can manage team access and invitations
const adminOnly = [authenticate, authorize(["super_admin", "admin"])];

router.get("/team/members", adminOnly, getTeamMembers);
router.post("/team/invite", adminOnly, createInvitation);
router.get("/team/invitations", adminOnly, getInvitations);
router.post("/team/invitations/:id/revoke", adminOnly, revokeInvitation);

router.get("/team/requests", adminOnly, getAccessRequests);
router.post("/team/requests/:id/approve", adminOnly, approveAccessRequest);
router.post("/team/requests/:id/reject", adminOnly, rejectAccessRequest);

export default router;