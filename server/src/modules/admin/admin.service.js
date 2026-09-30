import Category from "../category/category.model.js";
import Service from "../services/service.model.js";
import Lead from "../leads/lead.model.js";
import Listing from "../listings/listing.model.js";
import MarketplaceLead from "../marketplace-leads/lead.model.js";
import User from "../users/user.model.js";
import Auth from "../auth/auth.model.js";
import AuditLog from "../auth/audit-log.model.js";
import { realtimeHub } from "../realtime/realtime.hub.js";
import bcrypt from "bcryptjs";

export const getDashboardStats = async () => {
  const [totalCategories, totalServices, totalLeads, recentLeads] =
    await Promise.all([
      Category.countDocuments(),
      Service.countDocuments(),
      Lead.countDocuments(),
      Lead.find()
        .populate("services", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  return {
    totalCategories,
    totalServices,
    totalLeads,
    recentLeads,
  };
};

export const getMarketplaceAnalytics = async () => {
  const [
    totalVendors,
    totalListings,
    liveListings,
    pendingApprovalListings,
    totalLeads,
    newLeads,
  ] = await Promise.all([
    User.countDocuments({ role: "vendor" }),
    Listing.countDocuments({}),
    Listing.countDocuments({ isLive: true }),
    Listing.countDocuments({ status: "pending_review" }),
    MarketplaceLead.countDocuments({}),
    MarketplaceLead.countDocuments({ status: "new" }),
  ]);

  const pendingListings = await Listing.find({ status: "pending_review" })
    .populate("vendorId", "name businessName email phone")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return {
    stats: {
      totalVendors,
      totalListings,
      liveListings,
      pendingApprovalListings,
      totalLeads,
      newLeads,
    },
    pendingListings,
  };
};

export const getVendors = async () => {
  const vendors = await User.find({ role: "vendor" }).sort({ createdAt: -1 }).lean();
  const emails = vendors.map((v) => v.email?.toLowerCase().trim()).filter(Boolean);
  if (emails.length === 0) return vendors;

  const authRecords = await Auth.find({ email: { $in: emails } }).select("email lastLogin").lean();
  const authMap = new Map(authRecords.map((a) => [a.email.toLowerCase().trim(), a]));

  return vendors.map((v) => {
    const a = authMap.get(v.email?.toLowerCase().trim());
    if (a?.lastLogin) {
      const dateUser = v.lastLogin ? new Date(v.lastLogin).getTime() : 0;
      const dateAuth = new Date(a.lastLogin).getTime();
      if (dateAuth > dateUser) {
        return { ...v, lastLogin: a.lastLogin };
      }
    }
    return v;
  });
};

export const updateVendorStatus = async (vendorId, status, adminUser) => {
  if (!["active", "suspended"].includes(status)) {
    throw new Error("Invalid vendor status. Must be 'active' or 'suspended'.");
  }

  const vendor = await User.findById(vendorId);
  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  vendor.status = status;
  if (status === "suspended") {
    vendor.tokenVersion = (vendor.tokenVersion || 0) + 1;
  }
  await vendor.save();

  // Dual-collection synchronization with Auth collection
  const normalizedEmail = vendor.email.toLowerCase().trim();
  const authDoc = await Auth.findOne({ email: normalizedEmail });
  if (authDoc) {
    authDoc.status = status;
    authDoc.isActive = status === "active";
    if (status === "suspended") {
      authDoc.tokenVersion = (authDoc.tokenVersion || 0) + 1;
    }
    await authDoc.save();
  }

  await AuditLog.create({
    action: "admin_status_toggled",
    portal: "admin_portal",
    performedBy: adminUser?._id,
    targetEmail: vendor.email,
    targetUser: vendor._id,
    metadata: {
      newStatus: status,
      vendorName: vendor.name,
      businessName: vendor.businessName,
      role: vendor.role,
    },
  }).catch((err) => console.error("Audit log error:", err));

  realtimeHub.broadcast("users", "VENDOR_STATUS_CHANGED", {
    vendorId: vendor._id,
    status: vendor.status,
    isActive: vendor.status === "active",
    name: vendor.name,
    email: vendor.email,
    updatedBy: adminUser?.email,
  });

  realtimeHub.broadcast("team", "TEAM_MEMBER_STATUS_CHANGED", {
    memberId: authDoc ? authDoc._id.toString() : vendor._id.toString(),
    email: vendor.email,
    fullName: vendor.name,
    status,
    isActive: status === "active",
    updatedBy: adminUser?.email,
  });

  realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", {});
  realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", {});

  return vendor;
};

export const updateVendorRole = async (vendorId, newRole, adminUser) => {
  const normalizedRole = newRole === "super_admin" ? "superadmin" : newRole;
  if (!["vendor", "superadmin", "user"].includes(normalizedRole)) {
    throw new Error("Invalid role specified. Must be 'vendor', 'superadmin', or 'user'.");
  }

  let vendor = await User.findById(vendorId);
  const normalizedEmail = vendor?.email?.toLowerCase()?.trim();

  if (!vendor && normalizedEmail) {
    vendor = await User.findOne({ email: normalizedEmail });
  }

  if (!vendor) {
    // Check if target exists in Auth
    const authRecord = await Auth.findById(vendorId);
    if (authRecord) {
      // Find or create User record
      const aEmail = authRecord.email.toLowerCase().trim();
      vendor = await User.findOne({ email: aEmail });
      if (!vendor) {
        vendor = await User.create({
          name: authRecord.fullName,
          email: aEmail,
          phone: "",
          passwordHash: authRecord.password,
          role: normalizedRole,
          status: authRecord.isActive ? "active" : "suspended",
          businessName: authRecord.fullName + " Workspaces",
          tokenVersion: 1,
          lastLogin: authRecord.lastLogin || null,
        });
      }
    }
  }

  if (!vendor) {
    throw new Error("Target user or vendor not found.");
  }

  const oldRole = vendor.role;
  vendor.role = normalizedRole;
  vendor.tokenVersion = (vendor.tokenVersion || 0) + 1;
  await vendor.save();

  // Dual-collection synchronization with Auth collection
  const vEmail = vendor.email.toLowerCase().trim();
  let authDoc = await Auth.findOne({ email: vEmail }).select("+password");

  if (normalizedRole === "superadmin") {
    if (authDoc) {
      authDoc.role = "super_admin";
      authDoc.status = "active";
      authDoc.isActive = true;
      authDoc.tokenVersion = (authDoc.tokenVersion || 0) + 1;
      await authDoc.save();
    } else {
      authDoc = await Auth.create({
        fullName: vendor.name,
        email: vEmail,
        password: vendor.passwordHash || (await bcrypt.hash("Admin@123456", 10)),
        role: "super_admin",
        status: "active",
        isActive: true,
        lastLogin: vendor.lastLogin || null,
        tokenVersion: 1,
      });
    }
  } else {
    // "vendor" or "user"
    if (authDoc) {
      authDoc.role = normalizedRole === "vendor" ? "vendor" : "user";
      authDoc.tokenVersion = (authDoc.tokenVersion || 0) + 1;
      await authDoc.save();
    }
  }

  await AuditLog.create({
    action: "member_role_changed",
    portal: "admin_portal",
    performedBy: adminUser?._id,
    targetEmail: vendor.email,
    targetUser: vendor._id,
    metadata: {
      oldRole,
      newRole: normalizedRole,
      vendorName: vendor.name,
    },
  }).catch((err) => console.error("Audit log error:", err));

  realtimeHub.broadcast("users", "VENDOR_ROLE_CHANGED", {
    vendorId: vendor._id,
    oldRole,
    newRole: normalizedRole,
    name: vendor.name,
    email: vendor.email,
    updatedBy: adminUser?.email,
  });

  realtimeHub.broadcast("team", "TEAM_MEMBER_ROLE_CHANGED", {
    memberId: authDoc ? authDoc._id.toString() : vendor._id.toString(),
    email: vendor.email,
    fullName: vendor.name,
    previousRole: oldRole,
    newRole: normalizedRole === "superadmin" ? "super_admin" : normalizedRole,
    updatedBy: adminUser?.email || "Admin",
    timestamp: Date.now(),
  });

  realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", {});
  realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", {});

  return vendor;
};

export const deleteVendor = async (vendorId, adminUser) => {
  let vendor = await User.findById(vendorId);
  if (!vendor) {
    const authTarget = await Auth.findById(vendorId);
    if (authTarget) {
      vendor = await User.findOne({ email: authTarget.email.toLowerCase().trim() });
    }
  }

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  if (vendor.role === "superadmin" || vendor.role === "super_admin") {
    throw new Error("Cannot delete a Super Administrator via vendor management.");
  }

  await User.findByIdAndDelete(vendor._id);

  // Clean up any non-superadmin Auth counterpart
  await Auth.findOneAndDelete({
    email: vendor.email.toLowerCase().trim(),
    role: { $nin: ["super_admin", "superadmin"] },
  }).catch(() => {});

  await AuditLog.create({
    action: "member_deleted",
    portal: "admin_portal",
    performedBy: adminUser?._id,
    targetEmail: vendor.email,
    targetUser: vendor._id,
    metadata: {
      deletedRole: vendor.role,
      vendorName: vendor.name,
      businessName: vendor.businessName,
    },
  }).catch((err) => console.error("Audit log error:", err));

  realtimeHub.broadcast("users", "VENDOR_DELETED", {
    vendorId: vendor._id,
    email: vendor.email,
    name: vendor.name,
    deletedBy: adminUser?.email,
  });

  realtimeHub.broadcast("team", "TEAM_MEMBER_DELETED", {
    memberId: vendor._id.toString(),
    email: vendor.email,
    fullName: vendor.name,
    deletedBy: adminUser?.email,
  });

  realtimeHub.broadcast("users", "USER_DIRECTORY_UPDATED", {});
  realtimeHub.broadcast("team", "USER_DIRECTORY_UPDATED", {});

  return { success: true, message: `Vendor ${vendor.name} deleted successfully.` };
};

export const getAllPlatformUsers = async ({ role = "all", search = "" } = {}) => {
  const query = {};
  if (search && search.trim()) {
    const reg = { $regex: search.trim(), $options: "i" };
    query.$or = [{ name: reg }, { fullName: reg }, { email: reg }, { businessName: reg }];
  }

  const [adminUsers, vendorUsers] = await Promise.all([
    Auth.find(query).select("fullName email role status isActive lastLogin createdAt").lean(),
    User.find(query).select("name email phone businessName role status lastLogin lastLoginIp loginCount createdAt").lean(),
  ]);

  const userMap = new Map();

  // 1. Process User collection (coworking marketplace vendors and users)
  for (const u of vendorUsers) {
    let normalizedRole = "user";
    if (u.role === "superadmin" || u.role === "super_admin") {
      normalizedRole = "super_admin";
    } else if (u.role === "vendor") {
      normalizedRole = "vendor";
    } else {
      normalizedRole = "user";
    }

    userMap.set(u.email.toLowerCase(), {
      _id: u._id.toString(),
      name: u.name,
      fullName: u.name,
      email: u.email,
      phone: u.phone || "",
      businessName: u.businessName || (u.name + " Workspaces"),
      role: normalizedRole,
      portal: normalizedRole === "super_admin" ? "Admin Console" : "Vendor Partner Portal",
      status: u.status || "active",
      isActive: u.status === "active",
      lastLogin: u.lastLogin,
      lastLoginIp: u.lastLoginIp,
      loginCount: u.loginCount || 0,
      createdAt: u.createdAt || (u._id && typeof u._id.getTimestamp === "function" ? u._id.getTimestamp() : new Date()),
      sourceCollection: "MarketplaceUser",
    });
  }

  // 2. Merge Auth collection (administrative accounts & team members)
  for (const u of adminUsers) {
    const key = u.email.toLowerCase();
    let normalizedRole = "user";
    if (u.role === "super_admin" || u.role === "superadmin" || u.role === "admin") {
      normalizedRole = "super_admin";
    } else if (u.role === "vendor") {
      normalizedRole = "vendor";
    } else {
      normalizedRole = "user";
    }

    if (userMap.has(key)) {
      const existing = userMap.get(key);
      const dateExisting = existing.lastLogin ? new Date(existing.lastLogin).getTime() : 0;
      const dateAuth = u.lastLogin ? new Date(u.lastLogin).getTime() : 0;
      const latestLastLogin = dateAuth > dateExisting ? u.lastLogin : existing.lastLogin;

      userMap.set(key, {
        ...existing,
        // If Auth role is super_admin, authoritative role is super_admin; if demoted to vendor, reflect vendor
        role: normalizedRole === "super_admin" ? "super_admin" : (existing.role || normalizedRole),
        status: u.status || existing.status,
        isActive: u.isActive !== false && existing.isActive !== false,
        lastLogin: latestLastLogin,
        lastLoginIp: existing.lastLoginIp || u.lastLoginIp || null,
        loginCount: Math.max(existing.loginCount || 0, u.loginCount || 0),
        createdAt: existing.createdAt || u.createdAt || (u._id && typeof u._id.getTimestamp === "function" ? u._id.getTimestamp() : new Date()),
      });
    } else {
      userMap.set(key, {
        _id: u._id.toString(),
        name: u.fullName,
        fullName: u.fullName,
        email: u.email,
        phone: "",
        businessName: u.fullName + " Workspaces",
        role: normalizedRole,
        portal: normalizedRole === "super_admin" ? "Admin Console" : "Vendor Partner Portal",
        status: u.status || "active",
        isActive: u.isActive !== false && u.status === "active",
        lastLogin: u.lastLogin,
        createdAt: u.createdAt || (u._id && typeof u._id.getTimestamp === "function" ? u._id.getTimestamp() : new Date()),
        sourceCollection: "Auth",
      });
    }
  }

  let combined = Array.from(userMap.values());

  if (role === "vendor") {
    // Marketplace directory: return all marketplace participants (vendors & users), excluding active super_admins who belong in Admin Team
    combined = combined.filter((u) => u.role === "vendor" || u.role === "user");
  } else if (role === "admin" || role === "super_admin") {
    combined = combined.filter((u) => u.role === "super_admin");
  } else if (role && role !== "all") {
    combined = combined.filter((u) => u.role === role);
  }

  combined.sort((a, b) => {
    const timeA = new Date(a.lastLogin || a.createdAt || 0).getTime() || 0;
    const timeB = new Date(b.lastLogin || b.createdAt || 0).getTime() || 0;
    return timeB - timeA;
  });

  return {
    totalUsers: combined.length,
    users: combined,
    adminCount: Array.from(userMap.values()).filter((u) => u.role === "super_admin").length,
    vendorCount: Array.from(userMap.values()).filter((u) => u.role === "vendor").length,
  };
};

export const getAuditLogs = async ({ portal = "all", limit = 50 } = {}) => {
  const query = {};
  if (portal && portal !== "all") {
    query.portal = portal;
  }

  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 50)
    .lean();

  return logs;
};
