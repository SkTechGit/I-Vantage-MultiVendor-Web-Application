import mongoose from "mongoose";
import Auth from "./auth.model.js";
import User from "../users/user.model.js";
import { AUTH_COOKIE, AUTH_MESSAGES } from "./auth.constants.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../../utils/jwt.js";
import { setAuthCookie, clearAuthCookies, SCOPED_COOKIES } from "../../utils/cookie.js";

/**
 * Validate user status (active, not suspended/pending/rejected)
 */
const validateUser = (user, res) => {
  if (!user) {
    res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.UNAUTHORIZED,
    });
    return false;
  }

  if (user.status === "pending") {
    res.status(403).json({
      success: false,
      message: AUTH_MESSAGES.ACCOUNT_PENDING,
    });
    return false;
  }

  if (user.status === "rejected") {
    res.status(403).json({
      success: false,
      message: AUTH_MESSAGES.ACCOUNT_REJECTED,
    });
    return false;
  }

  if (user.status === "suspended" || user.isActive === false) {
    res.status(403).json({
      success: false,
      message: AUTH_MESSAGES.ACCOUNT_DISABLED,
    });
    return false;
  }

  return true;
};

/**
 * Helper to resolve user from Auth or User collections
 */
const resolveUserFromPayload = async (payload) => {
  if (!payload) return null;
  let user = null;

  // 1. Try finding by unique ID in Auth collection (Admin / Team)
  if (payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
    user = await Auth.findById(payload.id).select("-password");
  }

  // 2. Try finding by unique ID in User collection (Marketplace Vendors)
  if (!user && payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
    const mUser = await User.findById(payload.id).select("-passwordHash");
    if (mUser) {
      return {
        _id: mUser._id,
        id: mUser._id.toString(),
        fullName: mUser.name || mUser.fullName || "Partner",
        name: mUser.name || mUser.fullName || "Partner",
        email: mUser.email,
        role: mUser.role === "superadmin" ? "super_admin" : mUser.role,
        status: mUser.status || "active",
        isActive: mUser.status !== "suspended",
        tokenVersion: mUser.tokenVersion || 0,
      };
    }
  }

  // 3. Fallback to email resolution if id was not provided or not found
  if (!user && payload.email) {
    const normalizedEmail = payload.email.toLowerCase().trim();
    if (payload.role === "vendor") {
      const mUser = await User.findOne({ email: normalizedEmail }).select("-passwordHash");
      if (mUser) {
        return {
          _id: mUser._id,
          id: mUser._id.toString(),
          fullName: mUser.name || mUser.fullName || "Partner",
          name: mUser.name || mUser.fullName || "Partner",
          email: mUser.email,
          role: mUser.role === "superadmin" ? "super_admin" : mUser.role,
          status: mUser.status || "active",
          isActive: mUser.status !== "suspended",
          tokenVersion: mUser.tokenVersion || 0,
        };
      }
    }

    user = await Auth.findOne({ email: normalizedEmail }).select("-password");

    if (!user) {
      const mUser = await User.findOne({ email: normalizedEmail }).select("-passwordHash");
      if (mUser) {
        return {
          _id: mUser._id,
          id: mUser._id.toString(),
          fullName: mUser.name || mUser.fullName || "Partner",
          name: mUser.name || mUser.fullName || "Partner",
          email: mUser.email,
          role: mUser.role === "superadmin" ? "super_admin" : mUser.role,
          status: mUser.status || "active",
          isActive: mUser.status !== "suspended",
          tokenVersion: mUser.tokenVersion || 0,
        };
      }
    }
  }

  return user;
};

/**
 * Helper to attempt auto-regeneration of accessToken using refreshToken
 */
const tryAutoRefresh = async (req, res, next, targetPortal = null) => {
  let portal =
    targetPortal ||
    req.headers["x-portal"] ||
    req.query?.portal ||
    (req.baseUrl?.includes("vendor") || req.originalUrl?.includes("/vendor")
      ? "vendor"
      : req.baseUrl?.includes("professionals") || req.originalUrl?.includes("/professionals")
      ? "professional"
      : req.baseUrl?.includes("admin") || req.originalUrl?.includes("/admin")
      ? "admin"
      : "all");

  let refreshToken = null;
  let effectivePortal = portal;

  if (portal === "admin") {
    refreshToken = req.cookies[SCOPED_COOKIES.ADMIN_REFRESH] || req.headers["x-refresh-token"];
    // Fallback: Check if professional or vendor session is present on shared routes
    if (!refreshToken && req.cookies[SCOPED_COOKIES.PRO_REFRESH]) {
      refreshToken = req.cookies[SCOPED_COOKIES.PRO_REFRESH];
      effectivePortal = "professional";
    } else if (!refreshToken && req.cookies[SCOPED_COOKIES.VENDOR_REFRESH]) {
      refreshToken = req.cookies[SCOPED_COOKIES.VENDOR_REFRESH];
      effectivePortal = "vendor";
    }
  } else if (portal === "vendor") {
    refreshToken = req.cookies[SCOPED_COOKIES.VENDOR_REFRESH] || req.headers["x-refresh-token"];
    if (!refreshToken && req.cookies[SCOPED_COOKIES.ADMIN_REFRESH]) {
      refreshToken = req.cookies[SCOPED_COOKIES.ADMIN_REFRESH];
      effectivePortal = "admin";
    }
  } else if (portal === "professional") {
    refreshToken = req.cookies[SCOPED_COOKIES.PRO_REFRESH] || req.headers["x-refresh-token"];
    if (!refreshToken && req.cookies[SCOPED_COOKIES.ADMIN_REFRESH]) {
      refreshToken = req.cookies[SCOPED_COOKIES.ADMIN_REFRESH];
      effectivePortal = "admin";
    }
  } else {
    refreshToken =
      req.cookies[AUTH_COOKIE.REFRESH_NAME] ||
      req.cookies[SCOPED_COOKIES.ADMIN_REFRESH] ||
      req.cookies[SCOPED_COOKIES.VENDOR_REFRESH] ||
      req.cookies[SCOPED_COOKIES.PRO_REFRESH] ||
      req.headers["x-refresh-token"];
  }

  if (!refreshToken) {
    clearAuthCookies(res, effectivePortal);
    return res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }

  try {
    const refreshPayload = verifyRefreshToken(refreshToken);
    const user = await resolveUserFromPayload(refreshPayload);

    if (!validateUser(user, res)) return;

    if (
      user.tokenVersion !== undefined &&
      refreshPayload.tokenVersion !== undefined &&
      user.tokenVersion !== refreshPayload.tokenVersion
    ) {
      clearAuthCookies(res, effectivePortal);
      return res.status(401).json({
        success: false,
        code: "TOKEN_VERSION_MISMATCH",
        message: "Your session has expired or permissions changed. Please log in again.",
      });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    });

    setAuthCookie(res, newAccessToken, user.role, effectivePortal);

    req.user = user;
    return next();
  } catch {
    clearAuthCookies(res, effectivePortal);
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const portal =
      req.headers["x-portal"] ||
      req.query?.portal ||
      (req.baseUrl?.includes("vendor") || req.originalUrl?.includes("/vendor")
        ? "vendor"
        : req.baseUrl?.includes("professionals") || req.originalUrl?.includes("/professionals")
        ? "professional"
        : req.baseUrl?.includes("admin") || req.originalUrl?.includes("/admin")
        ? "admin"
        : "all");

    let token = null;
    let effectivePortal = portal;

    if (portal === "admin") {
      token = req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS];
      // Fallback: Check if professional or vendor session is present on shared routes
      if (!token && req.cookies?.[SCOPED_COOKIES.PRO_ACCESS]) {
        token = req.cookies[SCOPED_COOKIES.PRO_ACCESS];
        effectivePortal = "professional";
      } else if (!token && req.cookies?.[SCOPED_COOKIES.VENDOR_ACCESS]) {
        token = req.cookies[SCOPED_COOKIES.VENDOR_ACCESS];
        effectivePortal = "vendor";
      }
    } else if (portal === "vendor") {
      token = req.cookies?.[SCOPED_COOKIES.VENDOR_ACCESS];
      if (!token && req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS]) {
        token = req.cookies[SCOPED_COOKIES.ADMIN_ACCESS];
        effectivePortal = "admin";
      }
    } else if (portal === "professional") {
      token = req.cookies?.[SCOPED_COOKIES.PRO_ACCESS];
      if (!token && req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS]) {
        token = req.cookies[SCOPED_COOKIES.ADMIN_ACCESS];
        effectivePortal = "admin";
      }
    } else {
      token =
        req.cookies?.[AUTH_COOKIE.ACCESS_NAME] ||
        req.cookies?.[SCOPED_COOKIES.ADMIN_ACCESS] ||
        req.cookies?.[SCOPED_COOKIES.VENDOR_ACCESS] ||
        req.cookies?.[SCOPED_COOKIES.PRO_ACCESS];
    }

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return await tryAutoRefresh(req, res, next, effectivePortal);
    }

    try {
      const payload = verifyAccessToken(token);
      const user = await resolveUserFromPayload(payload);

      if (!validateUser(user, res)) return;

      if (
        user.tokenVersion !== undefined &&
        payload.tokenVersion !== undefined &&
        user.tokenVersion !== payload.tokenVersion
      ) {
        clearAuthCookies(res, effectivePortal);
        return res.status(401).json({
          success: false,
          code: "TOKEN_VERSION_MISMATCH",
          message: "Your session has expired. Please log in again.",
        });
      }

      req.user = user;
      return next();
    } catch {
      return await tryAutoRefresh(req, res, next, effectivePortal);
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<string>} roles Allowed roles e.g. ["super_admin", "admin"]
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const userRole = req.user.role === "superadmin" ? "super_admin" : req.user.role;
    const normalizedRoles = roles.map((r) => (r === "superadmin" ? "super_admin" : r));

    if (normalizedRoles.length && !normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: AUTH_MESSAGES.FORBIDDEN,
      });
    }

    next();
  };
};
