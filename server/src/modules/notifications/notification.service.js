import Notification from "./notification.model.js";
import { realtimeHub } from "../realtime/realtime.hub.js";
import mongoose from "mongoose";

/**
 * Creates and broadcasts a real-time notification
 */
export const createNotification = async ({
  title,
  message,
  category = "system",
  priority = "normal",
  actionUrl = "/admin/dashboard",
  metadata = {},
}) => {
  const notification = await Notification.create({
    title,
    message,
    category,
    priority,
    actionUrl,
    metadata,
    isRead: false,
  });

  const unreadCount = await Notification.countDocuments({ isRead: false });

  realtimeHub.broadcast("notifications", "NEW_NOTIFICATION", {
    notification: notification.toObject ? notification.toObject() : notification,
    unreadCount,
    timestamp: Date.now(),
  });

  realtimeHub.broadcast("dashboard", "METRIC_UPDATE", {
    unreadNotifications: unreadCount,
  });

  return notification;
};

/**
 * Auto-seeds initial notifications from actual DB records if empty
 */
export const seedInitialNotifications = async () => {
  try {
    const count = await Notification.countDocuments();
    if (count > 0) return;

    const db = mongoose.connection?.db;
    if (!db) return;

    // 1. Fetch real recent leads from marketplace_leads
    const leadsCol = db.collection("marketplace_leads");
    const recentLeads = await leadsCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();

    for (const l of recentLeads) {
      const client = l.clientName || l.fullName || l.name || "Commercial Client";
      const property = l.propertyTitle || l.listingTitle || "Managed Workspace";
      const plan = l.workspaceType || l.plan || "Dedicated Office";
      await Notification.create({
        title: `New Commercial Enquiry: ${client}`,
        message: `${client} (${l.phone || l.email || "Verified Lead"}) enquired for ${property} • ${plan}.`,
        category: "lead",
        priority: "high",
        actionUrl: "/admin/leads",
        metadata: { leadId: l._id, email: l.email, phone: l.phone },
        isRead: false,
        createdAt: l.createdAt || new Date(),
      });
    }

    // 2. Fetch real vendor activity
    const usersCol = db.collection("marketplace_users");
    const vendors = await usersCol
      .find({ role: "vendor" })
      .sort({ lastLogin: -1 })
      .limit(2)
      .toArray();

    for (const v of vendors) {
      if (v.lastLogin) {
        await Notification.create({
          title: `Vendor Partner Live: ${v.businessName || v.name}`,
          message: `${v.businessName || v.name} (${v.email}) signed in from ${v.lastLoginIp || "127.0.0.1"}.`,
          category: "vendor",
          priority: "normal",
          actionUrl: "/admin/team",
          metadata: { vendorId: v._id, email: v.email },
          isRead: false,
          createdAt: v.lastLogin || new Date(),
        });
      }
    }

    // 3. System operational alert
    await Notification.create({
      title: "Database & Authentication Operational",
      message: "Live synchronization active across Cloudflare tunnel & dual-auth session cookies.",
      category: "system",
      priority: "low",
      actionUrl: "/admin/dashboard",
      isRead: false,
      createdAt: new Date(),
    });
  } catch (seedErr) {
    console.warn("[seedInitialNotifications] Warning:", seedErr.message);
  }
};

/**
 * Retrieves notifications with unread counts
 */
export const getNotifications = async ({
  limit = 30,
  category = "all",
  unreadOnly = false,
} = {}) => {
  // Ensure initial data exists if collection was just created
  await seedInitialNotifications();

  const query = {};
  if (category && category !== "all") {
    query.category = category;
  }
  if (unreadOnly) {
    query.isRead = false;
  }

  const [notifications, unreadCount, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 30)
      .lean(),
    Notification.countDocuments({ isRead: false }),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    unreadCount,
    total,
  };
};

/**
 * Marks a single notification as read
 */
export const markAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true, readAt: new Date() },
    { new: true }
  ).lean();

  if (!notification) {
    throw new Error("Notification not found.");
  }

  const unreadCount = await Notification.countDocuments({ isRead: false });

  realtimeHub.broadcast("notifications", "NOTIFICATION_READ", {
    notificationId,
    unreadCount,
    timestamp: Date.now(),
  });

  return { notification, unreadCount };
};

/**
 * Marks all notifications as read
 */
export const markAllAsRead = async () => {
  const result = await Notification.updateMany(
    { isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  realtimeHub.broadcast("notifications", "NOTIFICATIONS_ALL_READ", {
    unreadCount: 0,
    timestamp: Date.now(),
  });

  return {
    success: true,
    modifiedCount: result.modifiedCount,
    unreadCount: 0,
  };
};

/**
 * Deletes a single notification
 */
export const deleteNotification = async (notificationId) => {
  const deleted = await Notification.findByIdAndDelete(notificationId);
  const unreadCount = await Notification.countDocuments({ isRead: false });

  realtimeHub.broadcast("notifications", "NOTIFICATION_DELETED", {
    notificationId,
    unreadCount,
    timestamp: Date.now(),
  });

  return { success: true, deleted, unreadCount };
};

/**
 * Deletes all notifications
 */
export const clearAllNotifications = async () => {
  await Notification.deleteMany({});
  realtimeHub.broadcast("notifications", "NOTIFICATIONS_ALL_READ", {
    unreadCount: 0,
    timestamp: Date.now(),
  });
  return { success: true, unreadCount: 0 };
};
