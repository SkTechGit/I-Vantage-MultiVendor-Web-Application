import { Router } from "express";
import {
  login,
  signup,
  register,
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
  updateMemberRole,
  toggleMemberStatus,
  deleteTeamMember,
} from "./auth.controller.js";
import { authenticate, authorize } from "./auth.middleware.js";
import { authRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Public Routes                               */
/* -------------------------------------------------------------------------- */

// High-security brute-force rate limiting (25 requests per 15 minutes per IP)
const authLimiter = authRateLimiter(25, 15 * 60 * 1000);

router.post("/login", authLimiter, login);
router.post("/signup", authLimiter, signup);
router.post("/register", authLimiter, register);
router.post("/refresh-token", refreshTokenHandler);
router.post("/refresh", refreshTokenHandler);
router.get("/invitation/validate", validateInvitation);
router.post("/logout", logout);

/* -------------------------------------------------------------------------- */
/*                            Authenticated Routes                            */
/* -------------------------------------------------------------------------- */

router.get("/me", authenticate, me);
router.get("/session", authenticate, me);

/* -------------------------------------------------------------------------- */
/*                      Admin Team Management Routes                          */
/* -------------------------------------------------------------------------- */

// Strictly super_admin only can manage team access, members, and invitations
const superAdminOnly = [authenticate, authorize(["super_admin"])];

router.get("/team/members", superAdminOnly, getTeamMembers);
router.patch("/team/members/:id/role", superAdminOnly, updateMemberRole);
router.patch("/team/members/:id/status", superAdminOnly, toggleMemberStatus);
router.delete("/team/members/:id", superAdminOnly, deleteTeamMember);
router.post("/team/invite", superAdminOnly, createInvitation);
router.get("/team/invitations", superAdminOnly, getInvitations);
router.post("/team/invitations/:id/revoke", superAdminOnly, revokeInvitation);

router.get("/team/requests", superAdminOnly, getAccessRequests);
router.post("/team/requests/:id/approve", superAdminOnly, approveAccessRequest);
router.post("/team/requests/:id/reject", superAdminOnly, rejectAccessRequest);

export default router;