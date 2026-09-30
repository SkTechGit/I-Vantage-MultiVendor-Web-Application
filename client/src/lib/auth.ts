/**
 * Frontend Auth Client Utilities
 * Strictly UI-Only: Delegated 100% to Express Backend (/api/v1/auth)
 */

import {
  getCurrentUser,
  getSessionUser,
  login,
  logout,
  refreshTokenApi,
  signup,
} from "@/modules/auth/auth.api";

export {
  getCurrentUser,
  getSessionUser,
  login,
  logout,
  refreshTokenApi,
  signup,
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "super_admin" | "vendor" | "user";
  status?: string;
  businessName?: string;
  phone?: string;
}
