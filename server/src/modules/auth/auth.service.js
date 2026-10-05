import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Auth from "./auth.model.js";
import User from "../users/user.model.js";
import AdminInvitation from "./admin-invitation.model.js";
import AuditLog from "./audit-log.model.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { realtimeHub } from "../realtime/realtime.hub.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";
import { sendRoleChangeNotification } from "../../utils/email.js";
import { createNotification } from "../notifications/notification.service.js";

/* -------------------------------------------------------------------------- */
/*                                    Login                                   */
/* -------------------------------------------------------------------------- */

export const login = async ({
  email,
  password,
  requiredRole,
  ipAddress = "127.0.0.1",
  userAgent = "Unknown",
}) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(400, "Invalid credentials payload format.", "INVALID_PAYLOAD");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try finding in Auth collection (SuperAdmin / Team members)
  let authUser = await Auth.findOne({ email: normalizedEmail }).select("+password");

  // 2. Try finding in User collection (Marketplace Vendors / Users)
  let mUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

  if (!authUser && !mUser) {
    // Perform dummy bcrypt comparison to neutralize timing attack email enumeration
    await bcrypt.compare(
      password,
      "$2a$10$e8Z4wT5Z5M4O3bK0mE9tOe8gB0rWv/0s6O3lX.F5B4M6kL7P8R0yC"
    ).catch(() => {});
    throw new ApiError(401, "Invalid email address or password.", "INVALID_CREDENTIALS");
  }

  // 3. Determine authoritative role state across Auth and Marketplace collections
  const isSuperAdmin = Boolean(
    (authUser && (authUser.role === "super_admin" || authUser.role === "superadmin")) ||
    (mUser && (mUser.role === "superadmin" || mUser.role === "super_admin"))
  );

  const isVendor =
    !isSuperAdmin &&
    Boolean(
      (authUser && authUser.role === "vendor") ||
      (mUser && mUser.role === "vendor")
    );

  const isUser = !isSuperAdmin && !isVendor;

  // 4. Strict Persona Isolation & Portal Validation (Product-Based RBAC Standard)
  // Each portal has an explicit security contract:
  // - Vendor Portal (requiredRole === "vendor") strictly permits 'vendor' role only.
  // - SuperAdmin Console (requiredRole === "superadmin") strictly permits 'super_admin' only.

  if (requiredRole === "vendor" && !isVendor) {
    if (isSuperAdmin) {
      throw new ApiError(
        403,
        "Access Denied: This portal is exclusively for Coworking Vendor Partners. Your account has Super Administrator privileges. Please sign in via the Enterprise Admin Portal.",
        "ROLE_MISMATCH",
        {
          currentRole: "super_admin",
          requiredRole: "vendor",
          correctPortalUrl: "/admin/login",
          signupUrl: "/vendor/signup",
          error: "Access Denied: This portal is exclusively for Coworking Vendor Partners. Your account has Super Administrator privileges. Please sign in via the Enterprise Admin Portal.",
        }
      );
    }

    throw new ApiError(
      403,
      "This portal is restricted to authorized Vendor Partners. Please register as a vendor partner.",
      "ROLE_MISMATCH",
      {
        currentRole: "user",
        requiredRole: "vendor",
        correctPortalUrl: "/login",
        signupUrl: "/vendor/signup",
        error: "This portal is restricted to authorized Vendor Partners. Please register as a vendor partner.",
      }
    );
  }

  if (requiredRole === "superadmin" && !isSuperAdmin) {
    if (isVendor) {
      throw new ApiError(
        403,
        "Access restricted to Super Administrators. Your account is registered as a Vendor Partner. Please log in through the Vendor Partner Portal.",
        "ROLE_MISMATCH",
        {
          currentRole: "vendor",
          requiredRole: "superadmin",
          correctPortalUrl: "/vendor/login",
          signupUrl: "/vendor/signup",
          error: "Access restricted to Super Administrators. Your account is registered as a Vendor Partner. Please log in through the Vendor Partner Portal.",
        }
      );
    }

    throw new ApiError(
      403,
      "Super Administrator privileges required. Access denied.",
      "ROLE_MISMATCH",
      {
        currentRole: "user",
        requiredRole: "superadmin",
        correctPortalUrl: "/login",
        error: "Super Administrator privileges required. Access denied.",
      }
    );
  }

  // Process Auth record if present (or preferred for admin logins)
  if (authUser && (requiredRole !== "vendor" || !mUser)) {
    if (authUser.status === "pending") {
      throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_PENDING);
    }
    if (authUser.status === "rejected") {
      throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_REJECTED);
    }
    if (authUser.status === "suspended" || !authUser.isActive) {
      throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
    }

    let isMatch = await authUser.comparePassword(password);
    if (!isMatch && mUser?.passwordHash) {
      // Self-healing fallback: If promoted from vendor/marketplace user
      const matchesMarketplaceHash = await bcrypt.compare(password, mUser.passwordHash);
      if (matchesMarketplaceHash) {
        isMatch = true;
        authUser.password = password; // Will be safely hashed by pre-save
        await authUser.save();
      }
    }
    if (!isMatch) {
      throw new ApiError(401, "Invalid password. Please check your credentials.", "INVALID_PASSWORD");
    }

    const now = new Date();
    authUser.lastLogin = now;
    await authUser.save();

    // Dual-collection synchronization with User collection
    let userCounterpart = await User.findOne({ email: authUser.email.toLowerCase().trim() });
    if (userCounterpart) {
      userCounterpart.lastLogin = now;
      userCounterpart.lastLoginIp = ipAddress;
      userCounterpart.loginCount = (userCounterpart.loginCount || 0) + 1;
      await userCounterpart.save().catch(() => {});
    }

    await AuditLog.create({
      action: "admin_login",
      portal: "admin_portal",
      targetEmail: authUser.email,
      targetUser: authUser._id,
      ipAddress,
      userAgent,
      metadata: { role: authUser.role },
    }).catch((err) => console.error("Audit log error:", err));

    const adminLoginPayload = {
      userId: authUser._id.toString(),
      email: authUser.email,
      name: authUser.fullName,
      role: authUser.role,
      portal: "admin_portal",
      lastLogin: now,
      lastLoginIp: ipAddress,
      loginCount: userCounterpart?.loginCount || 1,
      timestamp: Date.now(),
    };

    realtimeHub.broadcast("users", "USER_LOGIN", adminLoginPayload);
    realtimeHub.broadcast("team", "USER_LOGIN", adminLoginPayload);
    realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", adminLoginPayload);
    realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", adminLoginPayload);

    const accessToken = generateAccessToken({
      id: authUser._id,
      email: authUser.email,
      role: authUser.role,
      tokenVersion: authUser.tokenVersion || 0,
    });

    const refreshToken = generateRefreshToken({
      id: authUser._id,
      tokenVersion: authUser.tokenVersion || 0,
    });

    authUser.password = undefined;

    return {
      user: {
        _id: authUser._id,
        id: authUser._id.toString(),
        name: authUser.fullName,
        fullName: authUser.fullName,
        email: authUser.email,
        role: authUser.role,
        status: authUser.status,
      },
      token: accessToken,
      accessToken,
      refreshToken,
    };
  }

  // Otherwise process MarketplaceUser record
  if (mUser) {
    if (mUser.status === "suspended") {
      throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
    }

    let isMatch = await bcrypt.compare(password, mUser.passwordHash || "");
    if (!isMatch && authUser) {
      const authMatch = await authUser.comparePassword(password);
      if (authMatch) {
        isMatch = true;
        mUser.passwordHash = await bcrypt.hash(password, 10);
        await mUser.save();
      }
    }
    if (!isMatch) {
      throw new ApiError(401, "Invalid password. Please check your credentials.", "INVALID_PASSWORD");
    }

    const now = new Date();
    mUser.lastLogin = now;
    mUser.loginCount = (mUser.loginCount || 0) + 1;
    mUser.lastLoginIp = ipAddress;
    await mUser.save();

    // Dual-collection synchronization with Auth collection
    const authCounterpart = await Auth.findOne({ email: mUser.email.toLowerCase().trim() });
    if (authCounterpart) {
      authCounterpart.lastLogin = now;
      await authCounterpart.save().catch(() => {});
    }

    await AuditLog.create({
      action: "vendor_login",
      portal: "vendor_portal",
      targetEmail: mUser.email,
      targetUser: mUser._id,
      ipAddress,
      userAgent,
      metadata: {
        role: mUser.role,
        businessName: mUser.businessName,
        phone: mUser.phone,
      },
    }).catch((err) => console.error("Audit log error:", err));

    const vendorLoginPayload = {
      userId: mUser._id.toString(),
      email: mUser.email,
      name: mUser.name,
      role: mUser.role,
      portal: "vendor_portal",
      lastLogin: now,
      lastLoginIp: ipAddress,
      loginCount: mUser.loginCount,
      timestamp: Date.now(),
    };

    realtimeHub.broadcast("users", "USER_LOGIN", vendorLoginPayload);
    realtimeHub.broadcast("team", "USER_LOGIN", vendorLoginPayload);
    realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", vendorLoginPayload);
    realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", vendorLoginPayload);

    // Live SuperAdmin Notification
    createNotification({
      title: `Vendor Signed In: ${mUser.businessName || mUser.name}`,
      message: `${mUser.businessName || mUser.name} (${mUser.email}) signed into the Partner Portal from ${ipAddress || "127.0.0.1"}.`,
      category: "vendor",
      priority: "normal",
      actionUrl: "/admin/team",
      metadata: {
        vendorId: mUser._id.toString(),
        email: mUser.email,
        ipAddress,
      },
    }).catch(() => {});

    const effectiveRole = mUser.role === "superadmin" ? "super_admin" : mUser.role;

    const accessToken = generateAccessToken({
      id: mUser._id,
      email: mUser.email,
      role: effectiveRole,
      tokenVersion: mUser.tokenVersion || 0,
    });

    const refreshToken = generateRefreshToken({
      id: mUser._id,
      tokenVersion: mUser.tokenVersion || 0,
    });

    return {
      user: {
        _id: mUser._id,
        id: mUser._id.toString(),
        name: mUser.name,
        fullName: mUser.name,
        email: mUser.email,
        phone: mUser.phone,
        businessName: mUser.businessName,
        role: mUser.role,
        status: mUser.status,
      },
      token: accessToken,
      accessToken,
      refreshToken,
    };
  }

  throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
};

/* -------------------------------------------------------------------------- */
/*                            Marketplace Register                            */
/* -------------------------------------------------------------------------- */

export const register = async ({
  name,
  email,
  password,
  phone,
  businessName,
  role = "vendor",
  ipAddress = "127.0.0.1",
  userAgent = "Unknown",
}) => {
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const cleanPhone = phone ? String(phone).replace(/[\s\-\(\)]/g, "") : "";
  const normalizedPhone = cleanPhone.startsWith("+91")
    ? cleanPhone.slice(3)
    : cleanPhone.startsWith("91") && cleanPhone.length === 12
    ? cleanPhone.slice(2)
    : cleanPhone.startsWith("0") && cleanPhone.length === 11
    ? cleanPhone.slice(1)
    : cleanPhone;

  // Check collision in Auth and User
  const [existingAuth, existingUser] = await Promise.all([
    Auth.findOne({ email: normalizedEmail }),
    User.findOne({ email: normalizedEmail }),
  ]);

  if (existingAuth) {
    throw new ApiError(
      400,
      "This email is already registered as an Enterprise Administrator. Please log in to the Admin Console."
    );
  }

  if (existingUser) {
    throw new ApiError(
      400,
      "An account with this email already exists. Please sign in."
    );
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    phone: normalizedPhone || phone?.trim(),
    businessName: businessName?.trim(),
    role: role === "superadmin" ? "vendor" : role, // Never allow self-registering as superadmin
    status: "active",
    lastLogin: new Date(),
    lastLoginIp: ipAddress,
    loginCount: 1,
    registeredVia: "vendor_portal",
  });

  const effectiveRole = newUser.role;
  const accessToken = generateAccessToken({
    id: newUser._id,
    email: newUser.email,
    role: effectiveRole,
    tokenVersion: newUser.tokenVersion || 0,
  });

  const refreshToken = generateRefreshToken({
    id: newUser._id,
    tokenVersion: newUser.tokenVersion || 0,
  });

  await AuditLog.create({
    action: "vendor_registered",
    portal: "vendor_portal",
    performedBy: newUser._id,
    targetEmail: newUser.email,
    targetUser: newUser._id,
    ipAddress,
    userAgent,
    metadata: { role: newUser.role, businessName: newUser.businessName },
  }).catch((err) => console.error("Audit log error:", err));

  realtimeHub.broadcast("users", "USER_REGISTERED", {
    userId: newUser._id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    businessName: newUser.businessName,
    portal: "vendor_portal",
    createdAt: newUser.createdAt,
  });

  // Live SuperAdmin Notification
  createNotification({
    title: `New Partner Registered: ${newUser.businessName || newUser.name}`,
    message: `${newUser.name} registered workspace account (${newUser.email}).`,
    category: "vendor",
    priority: "high",
    actionUrl: "/admin/team",
    metadata: {
      vendorId: newUser._id.toString(),
      email: newUser.email,
      phone: newUser.phone,
    },
  }).catch(() => {});

  return {
    user: {
      _id: newUser._id,
      id: newUser._id.toString(),
      name: newUser.name,
      fullName: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      businessName: newUser.businessName,
      role: newUser.role,
      status: newUser.status,
    },
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

export const signup = async ({ fullName, email, password, phone, inviteToken }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanPhone = phone ? String(phone).replace(/[\s\-\(\)]/g, "") : "";
  const normalizedPhone = cleanPhone.startsWith("+91")
    ? cleanPhone.slice(3)
    : cleanPhone.startsWith("91") && cleanPhone.length === 12
    ? cleanPhone.slice(2)
    : cleanPhone.startsWith("0") && cleanPhone.length === 11
    ? cleanPhone.slice(1)
    : cleanPhone;

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
      phone: normalizedPhone || null,
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
      metadata: { role: user.role, invitationId: invitation._id, phone: normalizedPhone },
    }).catch((err) => console.error("Audit log error:", err));

    // Automatically generate session tokens for immediate login
    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      tokenVersion: user.tokenVersion || 0,
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
  // If no active super_admin exists, make super_admin, otherwise assign user role
  const superAdminExists = await Auth.exists({ role: "super_admin", status: "active" });
  const assignedRole = superAdminExists ? "user" : "super_admin";

  const user = new Auth({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: normalizedPhone || null,
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
    tokenVersion: user.tokenVersion || 0,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
    tokenVersion: user.tokenVersion || 0,
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

  // 1. Resolve user from Auth or User (vendor) collections
  let user = null;
  if (payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
    user = await Auth.findById(payload.id);
  }
  if (!user && payload.id && mongoose.Types.ObjectId.isValid(payload.id)) {
    user = await User.findById(payload.id);
  }

  if (!user && payload.email) {
    const normalizedEmail = payload.email.toLowerCase().trim();
    if (payload.role === "vendor") {
      user = await User.findOne({ email: normalizedEmail });
    }
    if (!user) {
      user = await Auth.findOne({ email: normalizedEmail });
    }
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }
  }

  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
  }

  if (user.status === "pending") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_PENDING);
  }

  if (user.status === "rejected") {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_REJECTED);
  }

  if (user.status === "suspended" || user.isActive === false) {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
  }

  // Verify tokenVersion to prevent refreshing invalidated sessions
  if (typeof payload.tokenVersion === "number" && payload.tokenVersion !== (user.tokenVersion || 0)) {
    throw new ApiError(401, "Session invalidated. Your role or credentials have changed. Please log in again.", "TOKEN_VERSION_MISMATCH");
  }

  const effectiveRole = user.role === "superadmin" ? "super_admin" : user.role;

  const newAccessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: effectiveRole,
    tokenVersion: user.tokenVersion || 0,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
    tokenVersion: user.tokenVersion || 0,
  });

  const normalizedUser = {
    _id: user._id,
    id: user._id.toString(),
    name: user.name || user.fullName || "User",
    fullName: user.fullName || user.name || "User",
    email: user.email,
    role: effectiveRole,
    status: user.status || "active",
  };

  return {
    user: normalizedUser,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/* -------------------------------------------------------------------------- */
/*                            Team Management APIs                            */
/* -------------------------------------------------------------------------- */

export const createInvitation = async ({ email, role = "vendor", adminId }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const allowedRoles = ["super_admin", "vendor", "user"];
  const targetRole = allowedRoles.includes(role) ? role : "vendor";

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
    role: targetRole,
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

  try {
    realtimeHub.broadcast("team", "TEAM_INVITATION_UPDATED", {
      invitationId: invitation._id.toString(),
      email: normalizedEmail,
      role: invitation.role,
      status: invitation.status,
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

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

  try {
    realtimeHub.broadcast("team", "TEAM_INVITATION_UPDATED", {
      invitationId: invitation._id.toString(),
      email: invitation.email,
      status: "revoked",
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

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

  try {
    realtimeHub.broadcast("team", "TEAM_REQUEST_UPDATED", {
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      status: "active",
      role,
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

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

  try {
    realtimeHub.broadcast("team", "TEAM_REQUEST_UPDATED", {
      userId: user._id.toString(),
      email: user.email,
      status: "rejected",
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

  user.password = undefined;
  return user;
};

export const getTeamMembers = async () => {
  // 1. Fetch authorized admins from Auth collection
  const authAdmins = await Auth.find({
    status: { $ne: "pending" },
    role: { $in: ["super_admin", "superadmin", "admin"] },
  })
    .select("fullName email role status isActive lastLogin createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Fetch any superadmin accounts registered in User collection
  const userAdmins = await User.find({
    role: { $in: ["superadmin", "super_admin"] },
  })
    .select("name email role status lastLogin createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // Deduplicate by email
  const memberMap = new Map();

  for (const u of authAdmins) {
    memberMap.set(u.email.toLowerCase(), {
      _id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      role: "super_admin",
      status: u.status || "active",
      isActive: u.isActive !== false && u.status === "active",
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      sourceCollection: "Auth",
    });
  }

  for (const u of userAdmins) {
    const key = u.email.toLowerCase();
    if (!memberMap.has(key)) {
      memberMap.set(key, {
        _id: u._id.toString(),
        fullName: u.name,
        email: u.email,
        role: "super_admin",
        status: u.status || "active",
        isActive: u.status === "active",
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
        sourceCollection: "MarketplaceUser",
      });
    }
  }

  return Array.from(memberMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const updateMemberRole = async (targetUserId, newRole, adminUser) => {
  const allowedRoles = ["super_admin", "vendor", "user"];
  if (!allowedRoles.includes(newRole)) {
    throw new ApiError(
      400,
      `Invalid role specified. Must be one of: ${allowedRoles.join(", ")}`
    );
  }

  // Prevent self-demotion or self-lockout
  const adminIdStr = (adminUser?._id || adminUser?.id || "").toString();
  if (targetUserId.toString() === adminIdStr) {
    throw new ApiError(
      400,
      "You cannot modify your own role to prevent system lockout."
    );
  }

  let user = await Auth.findById(targetUserId).select("+password");
  if (!user) {
    // If not in Auth, search in User collection
    const mUserDoc = await User.findById(targetUserId).select("+passwordHash");
    if (mUserDoc) {
      // Find or create Auth counterpart
      user = await Auth.findOne({ email: mUserDoc.email.toLowerCase().trim() }).select("+password");
      if (!user) {
        user = await Auth.create({
          fullName: mUserDoc.name,
          email: mUserDoc.email.toLowerCase().trim(),
          password: mUserDoc.passwordHash || (await bcrypt.hash("Admin@123456", 10)),
          role: newRole,
          status: mUserDoc.status || "active",
          isActive: mUserDoc.status === "active",
          lastLogin: mUserDoc.lastLogin || null,
        });
      }
    }
  }

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const previousRole = user.role;
  user.role = newRole;
  // Atomically increment tokenVersion to invalidate all existing sessions
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  // Dual-collection synchronization with marketplace_users
  const normalizedEmail = user.email.toLowerCase().trim();
  const marketplaceRole =
    newRole === "super_admin"
      ? "superadmin"
      : newRole === "vendor"
      ? "vendor"
      : "user";

  try {
    let mUser = await User.findOne({ email: normalizedEmail });
    if (mUser) {
      mUser.role = marketplaceRole;
      mUser.status = user.isActive ? "active" : "suspended";
      mUser.tokenVersion = (mUser.tokenVersion || 0) + 1;
      await mUser.save();
    } else if (newRole === "vendor" || newRole === "user") {
      await User.create({
        name: user.fullName,
        email: normalizedEmail,
        phone: "",
        passwordHash: user.password,
        role: marketplaceRole,
        status: user.isActive ? "active" : "suspended",
        businessName: user.fullName + " Workspaces",
        tokenVersion: 1,
        lastLogin: user.lastLogin || null,
      });
    }
  } catch (syncErr) {
    console.error("Marketplace users synchronization error:", syncErr);
  }

  // Audit log entry
  await AuditLog.create({
    action: "member_role_changed",
    performedBy: adminUser._id,
    targetEmail: user.email,
    targetUser: user._id,
    metadata: {
      previousRole,
      newRole,
      marketplaceRole,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Real-time live synchronization broadcast
  try {
    realtimeHub.broadcast("team", "TEAM_MEMBER_ROLE_CHANGED", {
      memberId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      previousRole,
      newRole,
      marketplaceRole,
      updatedBy: adminUser?.email || "Admin",
      timestamp: Date.now(),
    });

    realtimeHub.broadcast("users", "VENDOR_ROLE_CHANGED", {
      vendorId: user._id.toString(),
      email: user.email,
      oldRole: previousRole,
      newRole: marketplaceRole,
      name: user.fullName,
      updatedBy: adminUser?.email || "Admin",
    });

    realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", {});
    realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", {});
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

  user.password = undefined;

  // Send email notification about role change (fire-and-forget)
  sendRoleChangeNotification({
    email: user.email,
    fullName: user.fullName,
    previousRole,
    newRole,
    changedBy: adminUser?.fullName || adminUser?.email || "Admin",
  }).catch((err) => console.error("Role change email notification error:", err));

  return user;
};

export const toggleMemberStatus = async (targetUserId, isActive, adminUser) => {
  // Prevent self-lockout
  const adminIdStr = (adminUser?._id || adminUser?.id || "").toString();
  const adminEmail = (adminUser?.email || "").toLowerCase().trim();

  if (targetUserId.toString() === adminIdStr) {
    throw new ApiError(
      400,
      "You cannot modify your own active status to prevent system lockout."
    );
  }

  const user = await Auth.findById(targetUserId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.email.toLowerCase().trim() === adminEmail) {
    throw new ApiError(
      400,
      "You cannot modify your own active status to prevent system lockout."
    );
  }

  const previousStatus = user.status;
  const previousIsActive = user.isActive;

  const newStatus = isActive ? "active" : "suspended";
  user.isActive = Boolean(isActive);
  user.status = newStatus;
  // Increment tokenVersion to force session invalidation on suspend
  if (!isActive) {
    user.tokenVersion = (user.tokenVersion || 0) + 1;
  }
  await user.save();

  // Dual-collection synchronization with marketplace_users
  const normalizedEmail = user.email.toLowerCase().trim();
  try {
    const marketCol = mongoose.connection.db?.collection("marketplace_users");
    if (marketCol) {
      const updateOp = {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      };
      // Also increment tokenVersion when suspending
      if (!isActive) {
        updateOp.$inc = { tokenVersion: 1 };
      }
      await marketCol.updateOne(
        { email: normalizedEmail },
        updateOp
      );
    }
  } catch (syncErr) {
    console.error("Marketplace users synchronization error:", syncErr);
  }

  // Audit log entry
  await AuditLog.create({
    action: "member_status_toggled",
    performedBy: adminUser._id,
    targetEmail: user.email,
    targetUser: user._id,
    metadata: {
      previousStatus,
      previousIsActive,
      newStatus,
      isActive: Boolean(isActive),
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Real-time live synchronization broadcast
  try {
    realtimeHub.broadcast("team", "TEAM_MEMBER_STATUS_CHANGED", {
      memberId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      status: newStatus,
      isActive: Boolean(isActive),
      previousStatus,
      updatedBy: adminUser?.email || "Admin",
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

  user.password = undefined;
  return user;
};

export const deleteTeamMember = async (targetUserId, adminUser) => {
  // Prevent self-deletion / self-lockout
  const adminIdStr = (adminUser?._id || adminUser?.id || "").toString();
  const adminEmail = (adminUser?.email || "").toLowerCase().trim();

  if (targetUserId.toString() === adminIdStr) {
    throw new ApiError(
      400,
      "You cannot delete your own account to prevent system lockout."
    );
  }

  const user = await Auth.findById(targetUserId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.email.toLowerCase().trim() === adminEmail) {
    throw new ApiError(
      400,
      "You cannot delete your own account to prevent system lockout."
    );
  }

  const userEmail = user.email.toLowerCase().trim();
  const deletedUserData = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };

  // 1. Delete from Auth collection
  await Auth.findByIdAndDelete(targetUserId);

  // 2. Dual-collection synchronization: delete from marketplace_users
  try {
    const marketCol = mongoose.connection.db?.collection("marketplace_users");
    if (marketCol) {
      await marketCol.deleteOne({ email: userEmail });
    }
  } catch (syncErr) {
    console.error("Marketplace users deletion error:", syncErr);
  }

  // 3. Clean up invitations for this email if any
  try {
    const invCol = mongoose.connection.db?.collection("invitations");
    if (invCol) {
      await invCol.deleteMany({ email: userEmail });
    }
  } catch (invErr) {
    console.error("Invitation cleanup error:", invErr);
  }

  // 4. Audit log entry
  await AuditLog.create({
    action: "member_deleted",
    performedBy: adminUser._id,
    targetEmail: user.email,
    targetUser: user._id,
    metadata: {
      deletedMember: deletedUserData,
    },
  }).catch((err) => console.error("Audit log error:", err));

  // Real-time live synchronization broadcast
  try {
    realtimeHub.broadcast("team", "TEAM_MEMBER_DELETED", {
      memberId: targetUserId.toString(),
      email: userEmail,
      fullName: user.fullName,
      deletedBy: adminUser?.email || "Admin",
      timestamp: Date.now(),
    });
  } catch (rtErr) {
    console.error("Realtime broadcast error:", rtErr);
  }

  return {
    message: "Member successfully removed from team and access.",
    deletedUser: deletedUserData,
  };
};