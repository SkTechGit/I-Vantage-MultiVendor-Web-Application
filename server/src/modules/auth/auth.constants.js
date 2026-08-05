/* -------------------------------------------------------------------------- */
/*                             Authentication Messages                         */
/* -------------------------------------------------------------------------- */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_NOT_FOUND: "Account not found.",
  ACCOUNT_DISABLED: "Your account has been disabled.",

  UNAUTHORIZED: "Unauthorized access.",
  TOKEN_REQUIRED: "Authentication token is required.",
  INVALID_TOKEN: "Invalid or expired token.",
};

/* -------------------------------------------------------------------------- */
/*                                Cookie Config                               */
/* -------------------------------------------------------------------------- */

export const AUTH_COOKIE = {
  NAME: "accessToken",
};