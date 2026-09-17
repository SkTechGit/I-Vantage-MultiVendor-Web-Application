/* -------------------------------------------------------------------------- */
/*                             Authentication Messages                         */
/* -------------------------------------------------------------------------- */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_NOT_FOUND: "Account not found.",
  ACCOUNT_DISABLED: "Your account has been disabled.",
  ACCOUNT_PENDING: "Your account is pending approval by an administrator.",
  ACCOUNT_REJECTED: "Your admin access request was rejected.",

  SIGNUP_REQUEST_SUBMITTED: "Your access request has been submitted. An administrator will review your request shortly.",
  SIGNUP_INVITE_SUCCESS: "Admin account created successfully. Welcome to i-VANTAGE!",
  EMAIL_ALREADY_EXISTS: "An account with this email address already exists. Please sign in instead.",

  INVITATION_NOT_FOUND: "Invitation is invalid, expired, or has already been used.",
  INVITATION_EXPIRED: "This invitation has expired. Please request a new invitation from an administrator.",
  INVITATION_REVOKED: "This invitation has been revoked.",
  INVITATION_EMAIL_MISMATCH: "This invitation is registered for a different email address.",

  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "You do not have permission to perform this action.",
  TOKEN_REQUIRED: "Authentication token is required.",
  INVALID_TOKEN: "Invalid or expired token.",
};

/* -------------------------------------------------------------------------- */
/*                                Cookie Config                               */
/* -------------------------------------------------------------------------- */

export const AUTH_COOKIE = {
  NAME: "accessToken",
  ACCESS_NAME: "accessToken",
  REFRESH_NAME: "refreshToken",
};