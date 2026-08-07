import env from "../config/env.config.js";
import { AUTH_COOKIE } from "../modules/auth/auth.constants.js";

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE.NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE.NAME, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
  });
};