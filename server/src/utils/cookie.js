import env from "../config/env.config.js";
import { AUTH_COOKIE } from "../modules/auth/auth.constants.js";

const getBaseCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "strict" : "lax",
  domain: env.nodeEnv === "production" ? ".i-vantage.in" : undefined,
  path: "/",
});

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE.ACCESS_NAME, token, {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie(AUTH_COOKIE.REFRESH_NAME, token, {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) setAuthCookie(res, accessToken);
  if (refreshToken) setRefreshTokenCookie(res, refreshToken);
};

export const clearAuthCookies = (res) => {
  const options = getBaseCookieOptions();
  res.clearCookie(AUTH_COOKIE.ACCESS_NAME, options);
  res.clearCookie(AUTH_COOKIE.REFRESH_NAME, options);
};

export const clearAuthCookie = clearAuthCookies;