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
import { setAuthCookies, clearAuthCookies, SCOPED_COOKIES } from "../../utils/cookie.js";

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";
    const { user, token, accessToken, refreshToken } = await authService.login({
      ...validatedData,
      ipAddress,
      userAgent,
    });

    const portal =
      req.headers["x-portal"] ||
      (validatedData.requiredRole === "superadmin" ? "admin" : validatedData.requiredRole === "vendor" ? "vendor" : null) ||
      (user?.role === "super_admin" || user?.role === "superadmin" || user?.role === "admin" ? "admin" : user?.role === "vendor" ? "vendor" : "all");

    setAuthCookies(res, accessToken || token, refreshToken, user?.role, portal);

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
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";
    const result = await authService.signup({
      ...validatedData,
      ipAddress,
      userAgent,
    });

    const portal = req.headers["x-portal"] || (result.user?.role === "vendor" ? "vendor" : "admin");
    if (result.accessToken || result.token) {
      setAuthCookies(res, result.accessToken || result.token, result.refreshToken, result.user?.role, portal);
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
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";
    const { user, token, accessToken, refreshToken } = await authService.register({
      ...req.body,
      ipAddress,
      userAgent,
    });

    const portal = req.headers["x-portal"] || (user?.role === "vendor" ? "vendor" : "all");
    setAuthCookies(res, accessToken || token, refreshToken, user?.role, portal);

    res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      data: user,
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
  const portal =
    req.headers["x-portal"] ||
    req.query?.portal ||
    req.body?.portal ||
    (req.baseUrl?.includes("vendor") || req.originalUrl?.includes("/vendor") ? "vendor" : req.baseUrl?.includes("admin") || req.originalUrl?.includes("/admin") ? "admin" : "all");

  try {
    let rawToken = null;
    if (portal === "admin") {
      rawToken = req.cookies[SCOPED_COOKIES.ADMIN_REFRESH] || req.body?.refreshToken || req.headers["x-refresh-token"];
    } else if (portal === "vendor") {
      rawToken = req.cookies[SCOPED_COOKIES.VENDOR_REFRESH] || req.body?.refreshToken || req.headers["x-refresh-token"];
    } else {
      rawToken =
        req.cookies[AUTH_COOKIE.REFRESH_NAME] ||
        req.cookies[SCOPED_COOKIES.ADMIN_REFRESH] ||
        req.cookies[SCOPED_COOKIES.VENDOR_REFRESH] ||
        req.body?.refreshToken ||
        req.headers["x-refresh-token"];
    }

    if (!rawToken) {
      clearAuthCookies(res, portal);
      return res.status(401).json({
        success: false,
        message: "No active session refresh token found for this portal.",
      });
    }

    const { user, accessToken, refreshToken } = await authService.refreshToken(rawToken);

    setAuthCookies(res, accessToken, refreshToken, user?.role, portal);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    clearAuthCookies(res, portal);
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  const portal =
    req.query?.portal ||
    req.headers["x-portal"] ||
    req.body?.portal ||
    (req.baseUrl?.includes("vendor") || req.originalUrl?.includes("/vendor") ? "vendor" : req.baseUrl?.includes("admin") || req.originalUrl?.includes("/admin") ? "admin" : "all");
  clearAuthCookies(res, portal);

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