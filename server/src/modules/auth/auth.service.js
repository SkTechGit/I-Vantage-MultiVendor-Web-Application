import crypto from "crypto";
import Auth from "./auth.model.js";
import AdminInvitation from "./admin-invitation.model.js";
import AuditLog from "./audit-log.model.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                                    Login                                   */
/* -------------------------------------------------------------------------- */

export const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await Auth.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Account status verification
  if (user.status === "pending") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_PENDING);
  }

  if (user.status === "rejected") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_REJECTED);
  }

  if (user.status === "suspended" || !user.isActive) {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
  }

  // Compare password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Audit log
  await AuditLog.create({
    action: "admin_login",
    targetEmail: user.email,
    targetUser: user._id,
    metadata: { role: user.role },
  }).catch((err) => console.error("Audit log error:", err));

  // Generate JWTs
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.password = undefined;

  return {
    user,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

/* -------------------------------------------------------------------------- */
/*                            Validate Invitation Token                       */
/* -------------------------------------------------------------------------- */

export const validateInvitation = async (rawToken) => {
  if (!rawToken || typeof rawToken !== "string") {
    throw new ApiError(400, "Invitation token is required.");
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const invitation = await AdminInvitation.findOne({ tokenHash }).populate(
    "invitedBy",
    "fullName email"
  );

  if (!invitation) {
    throw new ApiError(404, AUTH_MESSAGES.INVITATION_NOT_FOUND);
  }

  if (invitation.status === "accepted" || invitation.acceptedAt) {
    throw new ApiError(400, "This invitation has already been accepted.");
  }

  if (invitation.status === "revoked") {
    throw new ApiError(400, AUTH_MESSAGES.INVITATION_REVOKED);
  }

  if (new Date() > new Date(invitation.expiresAt)) {
    invitation.status = "expired";
    await invitation.save();
    throw new ApiError(400, AUTH_MESSAGES.INVITATION_EXPIRED);
  }

  return {
    valid: true,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    invitedBy: invitation.invitedBy?.fullName || "An Administrator",
  };
};

/* -------------------------------------------------------------------------- */
/*                                   Signup                                   */
/* -------------------------------------------------------------------------- */

export const signup = async ({ fullName, email, password, inviteToken }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await Auth.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  // --- CASE A: With Invitation Token ---
  if (inviteToken && inviteToken.trim()) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(inviteToken.trim())
      .digest("hex");

    const invitation = await AdminInvitation.findOne({ tokenHash });

    if (!invitation) {
      throw new ApiError(404, AUTH_MESSAGES.INVITATION_NOT_FOUND);
    }

    if (invitation.status === "accepted" || invitation.acceptedAt) {
      throw new ApiError(400, "This invitation has already been used.");
    }

    if (invitation.status === "revoked") {
      throw new ApiError(400, AUTH_MESSAGES.INVITATION_REVOKED);
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = "expired";
      await invitation.save();
      throw new ApiError(400, AUTH_MESSAGES.INVITATION_EXPIRED);
    }

    if (invitation.email.toLowerCase() !== normalizedEmail) {
      throw new ApiError(400, AUTH_MESSAGES.INVITATION_EMAIL_MISMATCH);
    }

    // Create active admin account with the authorized role from invitation
    const user = new Auth({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: invitation.role,
      status: "active",
      isActive: true,
      invitedBy: invitation.invitedBy,
      approvedAt: new Date(),
    });

    await user.save();

    // Mark invitation as accepted
    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    await invitation.save();

    // Audit log
    await AuditLog.create({
      action: "admin_invitation_accepted",
      targetEmail: normalizedEmail,
      targetUser: user._id,
      metadata: { role: user.role, invitationId: invitation._id },
    }).catch((err) => console.error("Audit log error:", err));

    // Automatically generate session tokens for immediate login
    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    user.password = undefined;

    return {
      type: "invitation_accepted",
      message: AUTH_MESSAGES.SIGNUP_INVITE_SUCCESS,
      user,
      token: accessToken,
      accessToken,
      refreshToken,
    };
  }

  // --- CASE B: Dynamic Admin Account Creation ---
  // If no active super_admin exists, make super_admin, otherwise assign admin role
  const superAdminExists = await Auth.exists({ role: "super_admin", status: "active" });
  const assignedRole = superAdminExists ? "admin" : "super_admin";

  const user = new Auth({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: assignedRole,
    status: "active",
    isActive: true,
    approvedAt: new Date(),
  });

  await user.save();

  // Audit log
  await AuditLog.create({
    action: "admin_created",
    targetEmail: normalizedEmail,
    targetUser: user._id,
    metadata: { role: assignedRole },
  }).catch((err) => console.error("Audit log error:", err));

  // Automatically generate session tokens for immediate login
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.password = undefined;

  return {
    type: "admin_created",
    message: "Admin account created successfully. Welcome to i-VANTAGE!",
    user,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

/* -------------------------------------------------------------------------- */
/*                                Refresh Token                               */
/* -------------------------------------------------------------------------- */

export const refreshToken = async (rawRefreshToken) => {
  if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
    throw new ApiError(401, AUTH_MESSAGES.TOKEN_REQUIRED);
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await Auth.findById(payload.id);

  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
  }

  if (user.status === "pending") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_PENDING);
  }

  if (user.status === "rejected") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_REJECTED);
  }

  if (user.status === "suspended" || !user.isActive) {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
  });

  user.password = undefined;

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/* -------------------------------------------------------------------------- */
/*                            Team Management APIs                            */
/* -------------------------------------------------------------------------- */

export const createInvitation = async ({ email, role = "admin", adminId }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if active user already exists
  const existingUser = await Auth.findOne({ email: normalizedEmail });
  if (existingUser && existingUser.status === "active") {
    throw new ApiError(
      400,
      `An active user with email "${normalizedEmail}" already exists.`
    );
  }

  // Revoke any previous pending invitations for this email
  await AdminInvitation.updateMany(
    { email: normalizedEmail, status: "pending" },
    { status: "revoked" }
  );

  // Generate cryptographically secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

  const invitation = await AdminInvitation.create({
    email: normalizedEmail,
    role,
    tokenHash,
    invitedBy: adminId,
    expiresAt,
    status: "pending",
  });

  // Audit log
  await AuditLog.create({
    action: "admin_invited",
    performedBy: adminId,
    targetEmail: normalizedEmail,
    metadata: { role, invitationId: invitation._id },
  }).catch((err) => console.error("Audit log error:", err));

  return {
    rawToken,
    invitation: {
      _id: invitation._id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
      createdAt: invitation.createdAt,
    },
  };
};

export const getInvitations = async () => {
  return await AdminInvitation.find()
    .populate("invitedBy", "fullName email")
    .sort({ createdAt: -1 })
    .lean();
};

export const revokeInvitation = async (invitationId, adminId) => {
  const invitation = await AdminInvitation.findById(invitationId);

  if (!invitation) {
    throw new ApiError(404, "Invitation not found.");
  }

  invitation.status = "revoked";
  await invitation.save();

  return invitation;
};

export const getAccessRequests = async () => {
  return await Auth.find({ status: "pending" })
    .select("fullName email role status createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const approveAccessRequest = async (userId, role = "admin", adminId) => {
  const user = await Auth.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.status === "active") {
    throw new ApiError(400, "User is already active.");
  }

  user.status = "active";
  user.isActive = true;
  user.role = role;
  user.approvedBy = adminId;
  user.approvedAt = new Date();

  await user.save();

  // Audit log
  await AuditLog.create({
    action: "admin_approved",
    performedBy: adminId,
    targetEmail: user.email,
    targetUser: user._id,
    metadata: { assignedRole: role },
  }).catch((err) => console.error("Audit log error:", err));

  user.password = undefined;
  return user;
};

export const rejectAccessRequest = async (userId, adminId) => {
  const user = await Auth.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.status = "rejected";
  user.isActive = false;
  user.approvedBy = adminId;

  await user.save();

  // Audit log
  await AuditLog.create({
    action: "admin_rejected",
    performedBy: adminId,
    targetEmail: user.email,
    targetUser: user._id,
  }).catch((err) => console.error("Audit log error:", err));

  user.password = undefined;
  return user;
};

export const getTeamMembers = async () => {
  return await Auth.find({ status: { $ne: "pending" } })
    .select("fullName email role status isActive lastLogin createdAt")
    .sort({ createdAt: -1 })
    .lean();
};