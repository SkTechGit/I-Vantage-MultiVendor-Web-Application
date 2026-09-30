import env from "../config/env.config.js";
import { AUTH_COOKIE } from "../modules/auth/auth.constants.js";

const getBaseCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "strict" : "lax",
  domain: env.nodeEnv === "production" ? ".i-vantage.in" : undefined,
  path: "/",
});

export const SCOPED_COOKIES = {
  ADMIN_ACCESS: "iv_admin_token",
  ADMIN_REFRESH: "iv_admin_refresh",
  VENDOR_ACCESS: "iv_vendor_token",
  VENDOR_REFRESH: "iv_vendor_refresh",
  GLOBAL_ACCESS: "accessToken",
  GLOBAL_REFRESH: "refreshToken",
};

export const setAuthCookie = (res, token, role = null, portal = null) => {
  const options = getBaseCookieOptions();
  const isSuperAdmin = portal === "admin" || role === "super_admin" || role === "superadmin" || role === "admin";
  const isVendor = portal === "vendor" || role === "vendor";

  if (isSuperAdmin) {
    res.cookie(SCOPED_COOKIES.ADMIN_ACCESS, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  } else if (isVendor) {
    res.cookie(SCOPED_COOKIES.VENDOR_ACCESS, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  } else {
    // Only set generic cookie for public/customer users without portal scope
    res.cookie(AUTH_COOKIE.ACCESS_NAME, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }
};

export const setRefreshTokenCookie = (res, token, role = null, portal = null) => {
  const options = getBaseCookieOptions();
  const isSuperAdmin = portal === "admin" || role === "super_admin" || role === "superadmin" || role === "admin";
  const isVendor = portal === "vendor" || role === "vendor";

  if (isSuperAdmin) {
    res.cookie(SCOPED_COOKIES.ADMIN_REFRESH, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  } else if (isVendor) {
    res.cookie(SCOPED_COOKIES.VENDOR_REFRESH, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  } else {
    // Only set generic refresh cookie for public/customer users without portal scope
    res.cookie(AUTH_COOKIE.REFRESH_NAME, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }
};

export const setAuthCookies = (res, accessToken, refreshToken, role = null, portal = null) => {
  if (accessToken) setAuthCookie(res, accessToken, role, portal);
  if (refreshToken) setRefreshTokenCookie(res, refreshToken, role, portal);
};

export const clearAuthCookies = (res, portal = "all") => {
  const options = getBaseCookieOptions();
  if (portal === "admin") {
    res.clearCookie(SCOPED_COOKIES.ADMIN_ACCESS, options);
    res.clearCookie(SCOPED_COOKIES.ADMIN_REFRESH, options);
  } else if (portal === "vendor") {
    res.clearCookie(SCOPED_COOKIES.VENDOR_ACCESS, options);
    res.clearCookie(SCOPED_COOKIES.VENDOR_REFRESH, options);
  } else {
    // portal === "all" or general clear
    res.clearCookie(SCOPED_COOKIES.ADMIN_ACCESS, options);
    res.clearCookie(SCOPED_COOKIES.ADMIN_REFRESH, options);
    res.clearCookie(SCOPED_COOKIES.VENDOR_ACCESS, options);
    res.clearCookie(SCOPED_COOKIES.VENDOR_REFRESH, options);
    res.clearCookie(AUTH_COOKIE.ACCESS_NAME, options);
    res.clearCookie(AUTH_COOKIE.REFRESH_NAME, options);
  }
};

export const clearAuthCookie = clearAuthCookies;
