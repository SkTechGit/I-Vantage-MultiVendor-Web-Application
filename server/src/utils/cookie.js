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
  PRO_ACCESS: "iv_pro_token",
  PRO_REFRESH: "iv_pro_refresh",
  GLOBAL_ACCESS: "accessToken",
  GLOBAL_REFRESH: "refreshToken",
};

export const setAuthCookie = (res, token, role = null, portal = null) => {
  const options = getBaseCookieOptions();
  const isSuperAdmin = portal === "admin" || role === "super_admin" || role === "superadmin";
  const isVendor = portal === "vendor" || role === "vendor";
  const isPro = portal === "professional" || role === "professional";

  let cookieSet = false;

  if (isPro) {
    res.cookie(SCOPED_COOKIES.PRO_ACCESS, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    cookieSet = true;
  }
  if (isVendor) {
    res.cookie(SCOPED_COOKIES.VENDOR_ACCESS, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    cookieSet = true;
  }
  if (isSuperAdmin) {
    res.cookie(SCOPED_COOKIES.ADMIN_ACCESS, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    cookieSet = true;
  }

  if (!cookieSet) {
    // Only set generic cookie for public/customer users without portal scope
    res.cookie(AUTH_COOKIE.ACCESS_NAME, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }
};

export const setRefreshTokenCookie = (res, token, role = null, portal = null) => {
  const options = getBaseCookieOptions();
  const isSuperAdmin = portal === "admin" || role === "super_admin" || role === "superadmin";
  const isVendor = portal === "vendor" || role === "vendor";
  const isPro = portal === "professional" || role === "professional";

  let cookieSet = false;

  if (isPro) {
    res.cookie(SCOPED_COOKIES.PRO_REFRESH, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    cookieSet = true;
  }
  if (isVendor) {
    res.cookie(SCOPED_COOKIES.VENDOR_REFRESH, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    cookieSet = true;
  }
  if (isSuperAdmin) {
    res.cookie(SCOPED_COOKIES.ADMIN_REFRESH, token, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    cookieSet = true;
  }

  if (!cookieSet) {
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

const clearSingleCookie = (res, name) => {
  const options = getBaseCookieOptions();
  res.clearCookie(name, options);
  if (options.domain) {
    // Also clear host-only cookie variant to ensure cross-domain/local cleanup
    const { domain, ...hostOpts } = options;
    res.clearCookie(name, hostOpts);
  }
};

export const clearAuthCookies = (res, portal = "all") => {
  if (portal === "admin") {
    clearSingleCookie(res, SCOPED_COOKIES.ADMIN_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.ADMIN_REFRESH);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_REFRESH);
  } else if (portal === "vendor") {
    clearSingleCookie(res, SCOPED_COOKIES.VENDOR_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.VENDOR_REFRESH);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_REFRESH);
  } else if (portal === "professional") {
    clearSingleCookie(res, SCOPED_COOKIES.PRO_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.PRO_REFRESH);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_REFRESH);
  } else {
    // portal === "all" or general clear
    clearSingleCookie(res, SCOPED_COOKIES.ADMIN_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.ADMIN_REFRESH);
    clearSingleCookie(res, SCOPED_COOKIES.VENDOR_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.VENDOR_REFRESH);
    clearSingleCookie(res, SCOPED_COOKIES.PRO_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.PRO_REFRESH);
    clearSingleCookie(res, AUTH_COOKIE.ACCESS_NAME);
    clearSingleCookie(res, AUTH_COOKIE.REFRESH_NAME);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_ACCESS);
    clearSingleCookie(res, SCOPED_COOKIES.GLOBAL_REFRESH);
  }
};

export const clearAuthCookie = clearAuthCookies;
