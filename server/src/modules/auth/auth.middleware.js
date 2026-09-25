import mongoose from "mongoose";
import Auth from "./auth.model.js";
import { AUTH_COOKIE, AUTH_MESSAGES } from "./auth.constants.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../../utils/jwt.js";
import { setAuthCookie, clearAuthCookies } from "../../utils/cookie.js";

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

  if (user.status === "suspended" || !user.isActive) {
    res.status(403).json({
      success: false,
      message: AUTH_MESSAGES.ACCOUNT_DISABLED,
    });
    return false;
  }

  return true;
};

/**
 * Helper to resolve user from auths or marketplace_users collection
 */
const resolveUserFromPayload = async (payload) => {
  if (!payload) return null;
  let user = null;

  if (payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
    user = await Auth.findById(payload.id).select("-password");
  }

  if (!user && payload.email) {
    user = await Auth.findOne({ email: payload.email.toLowerCase().trim() }).select("-password");
  }

  if (!user) {
    // Check marketplace_users collection for unified session resolution
    const filter = [];
    if (payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
      filter.push({ _id: new mongoose.Types.ObjectId(payload.id) });
    }
    if (payload.email) {
      filter.push({ email: payload.email.toLowerCase().trim() });
    }
    if (filter.length > 0) {
      const mUser = await mongoose.connection.db?.collection("marketplace_users").findOne({ $or: filter });
      if (mUser) {
        user = {
          _id: mUser._id,
          id: mUser._id.toString(),
          fullName: mUser.name || mUser.fullName || "Administrator",
          name: mUser.name || mUser.fullName || "Administrator",
          email: mUser.email,
          role: mUser.role === "superadmin" ? "super_admin" : mUser.role,
          status: mUser.status || "active",
          isActive: mUser.status !== "suspended",
        };
      }
    }
  }

  return user;
};

/**
 * Helper to attempt auto-regeneration of accessToken using refreshToken
 */
const tryAutoRefresh = async (req, res, next) => {
  const refreshToken =
    req.cookies[AUTH_COOKIE.REFRESH_NAME] ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }

  try {
    const refreshPayload = verifyRefreshToken(refreshToken);
    const user = await resolveUserFromPayload(refreshPayload);

    if (!validateUser(user, res)) return;

    // Regenerate a fresh access token
    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Attach new cookie to response so client browser receives updated token automatically
    setAuthCookie(res, newAccessToken);

    req.user = user;
    return next();
  } catch {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
};

export const authenticate = async (req, res, next) => {
  try {
    let token =
      req.cookies[AUTH_COOKIE.ACCESS_NAME] ||
      req.cookies[AUTH_COOKIE.NAME];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // Access token missing: attempt seamless auto-refresh with refreshToken
      return await tryAutoRefresh(req, res, next);
    }

    try {
      const payload = verifyAccessToken(token);
      const user = await resolveUserFromPayload(payload);

      if (!validateUser(user, res)) return;

      req.user = user;
      return next();
    } catch {
      // Token expired or invalid: attempt seamless auto-refresh
      return await tryAutoRefresh(req, res, next);
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

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: AUTH_MESSAGES.FORBIDDEN,
      });
    }

    next();
  };
};