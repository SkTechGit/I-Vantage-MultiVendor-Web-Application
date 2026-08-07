import { login as loginService } from "./auth.service.js";
import {loginSchema} from "./auth.validation.js"
import { AUTH_MESSAGES } from "./auth.constants.js";
import { setAuthCookie, clearAuthCookie } from "../../utils/cookie.js";

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { user, token } = await loginService(validatedData);

    setAuthCookie(res, token);
    console.log("NEW ACCESS TOKEN:", token);
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
 * GET /api/v1/auth/me
 */
export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
  });
};