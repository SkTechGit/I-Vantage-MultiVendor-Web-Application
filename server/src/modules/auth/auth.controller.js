import * as authService from "./auth.service.js";
import {
  loginSchema,
  signupSchema,
  createInviteSchema,
  approveRequestSchema,
  updateRoleSchema,
  toggleStatusSchema,
} from "./auth.validation.js";
import { AUTH_MESSAGES, AUTH_COOKIE } from "./auth.constants.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookie.js";

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token, accessToken, refreshToken } = await authService.login(validatedData);

    setAuthCookies(res, accessToken || token, refreshToken);

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const result = await authService.signup(validatedData);

    if (result.accessToken || result.token) {
      setAuthCookies(res, result.accessToken || result.token, result.refreshToken);
    }

    res.status(201).json({
      success: true,
      type: result.type,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/invitation/validate?token=...
 */
export const validateInvitation = async (req, res, next) => {
  try {
    const { token } = req.query;
    const data = await authService.validateInvitation(token);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 */
export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

/**
 * POST /api/v1/auth/refresh-token or /api/v1/auth/refresh
 */
export const refreshTokenHandler = async (req, res, next) => {
  try {
    const rawToken =
      req.cookies[AUTH_COOKIE.REFRESH_NAME] ||
      req.body?.refreshToken ||
      req.headers["x-refresh-token"];

    const { user, accessToken, refreshToken } = await authService.refreshToken(rawToken);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Team Management APIs                            */
/* -------------------------------------------------------------------------- */

/**
 * POST /api/v1/auth/team/invite
 */
export const createInvitation = async (req, res, next) => {
  try {
    const validatedData = createInviteSchema.parse(req.body);
    const result = await authService.createInvitation({
      ...validatedData,
      adminId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: `Invitation generated for ${result.invitation.email}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/team/invitations
 */
export const getInvitations = async (req, res, next) => {
  try {
    const data = await authService.getInvitations();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/team/invitations/:id/revoke
 */
export const revokeInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await authService.revokeInvitation(id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Invitation revoked successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/team/requests
 */
export const getAccessRequests = async (req, res, next) => {
  try {
    const data = await authService.getAccessRequests();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/team/requests/:id/approve
 */
export const approveAccessRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = approveRequestSchema.parse(req.body);
    const user = await authService.approveAccessRequest(id, role, req.user._id);

    res.status(200).json({
      success: true,
      message: `Access approved for ${user.fullName} (${user.email}) as ${role}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/team/requests/:id/reject
 */
export const rejectAccessRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await authService.rejectAccessRequest(id, req.user._id);

    res.status(200).json({
      success: true,
      message: `Access request for ${user.fullName} (${user.email}) was rejected.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/team/members
 */
export const getTeamMembers = async (req, res, next) => {
  try {
    const data = await authService.getTeamMembers();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/auth/team/members/:id/role
 */
export const updateMemberRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = updateRoleSchema.parse(req.body);
    const user = await authService.updateMemberRole(id, role, req.user);

    res.status(200).json({
      success: true,
      message: `Role updated to ${role} successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/auth/team/members/:id/status
 */
export const toggleMemberStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = toggleStatusSchema.parse(req.body);
    const user = await authService.toggleMemberStatus(id, isActive, req.user);

    res.status(200).json({
      success: true,
      message: `Member status updated to ${isActive ? "active" : "suspended"} successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/auth/team/members/:id
 */
export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await authService.deleteTeamMember(id, req.user);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedUser,
    });
  } catch (error) {
    next(error);
  }
};