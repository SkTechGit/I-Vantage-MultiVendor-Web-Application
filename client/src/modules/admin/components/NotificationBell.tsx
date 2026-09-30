"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Briefcase,
  Shield,
  Clock,
  Trash2,
  ArrowRight,
  Filter,
  Inbox,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRealtimeEvent, useRealtime } from "@/context/RealtimeContext";
import {
  AdminNotification,
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../notifications.api";

type CategoryFilter = "all" | "lead" | "vendor" | "listing";

function formatRelativeTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useRealtime();

  // Load notifications from server
  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getAdminNotifications({ limit: 40 });
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number }; message?: string };
      if (axiosErr?.response?.status === 401) return;
      console.warn("Notifications sync notice:", axiosErr?.message || err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  // Re-sync notifications automatically when realtime connects/reconnects
  useEffect(() => {
    if (isConnected) {
      loadNotifications(true);
    }
  }, [isConnected, loadNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Real-time SSE Listeners
  useRealtimeEvent("notifications", "NEW_NOTIFICATION", (payload) => {
    if (!payload?.notification) return;

    setNotifications((prev) => {
      const exists = prev.some((n) => n._id === payload.notification._id);
      if (exists) return prev;
      return [payload.notification, ...prev];
    });

    if (typeof payload.unreadCount === "number") {
      setUnreadCount(payload.unreadCount);
    } else {
      setUnreadCount((c) => c + 1);
    }

    toast.info(payload.notification.title, {
      description: payload.notification.message,
      action: payload.notification.actionUrl
        ? {
            label: "View",
            onClick: () => router.push(payload.notification.actionUrl),
          }
        : undefined,
    });
  });

  useRealtimeEvent("notifications", "NOTIFICATION_READ", (payload) => {
    if (payload?.notificationId) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === payload.notificationId ? { ...n, isRead: true } : n
        )
      );
    }
    if (typeof payload?.unreadCount === "number") {
      setUnreadCount(payload.unreadCount);
    }
  });

  useRealtimeEvent("notifications", "NOTIFICATIONS_ALL_READ", () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  });

  useRealtimeEvent("notifications", "NOTIFICATION_DELETED", (payload) => {
    if (payload?.notificationId) {
      setNotifications((prev) =>
        prev.filter((n) => n._id !== payload.notificationId)
      );
    }
    if (typeof payload?.unreadCount === "number") {
      setUnreadCount(payload.unreadCount);
    }
  });

  // Handle clicking a notification
  const handleNotificationClick = async (notif: AdminNotification) => {
    if (!notif.isRead) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(notif._id).catch(() => {});
    }

    setIsOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read");
    } catch {
      loadNotifications(true);
    }
  };

  // Delete single notification
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      const res = await deleteNotification(id);
      if (typeof res?.unreadCount === "number") {
        setUnreadCount(res.unreadCount);
      }
    } catch {
      loadNotifications(true);
    }
  };

  // Clear all
  const handleClearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await clearAllNotifications();
      toast.success("Notifications cleared");
    } catch {
      loadNotifications(true);
    }
  };

  // Filtered notifications
  const filteredList = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const categoryCounts = useMemo(() => {
    return {
      all: notifications.length,
      lead: notifications.filter((n) => n.category === "lead").length,
      vendor: notifications.filter((n) => n.category === "vendor").length,
      listing: notifications.filter((n) => n.category === "listing").length,
    };
  }, [notifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 ${
          isOpen
            ? "bg-blue-50 text-[#1E5BFF]"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
        }`}
        title={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
            : "Notifications (All caught up)"
        }
      >
        <Bell size={18} className="transition-transform active:scale-95" />

        {/* Dynamic Red Badge Counter (ONLY shown if unreadCount > 0, disappears on read) */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in-75 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-x-3 top-[68px] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[410px] max-w-sm sm:max-w-none mx-auto sm:mx-0 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[520px]">
          {/* Header */}
          <div className="p-3.5 pb-2.5 border-b border-slate-100/90 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600 border border-rose-200/60">
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 size={11} />
                    All caught up
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5BFF] hover:text-blue-700 transition hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none pt-0.5">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "lead", label: "Leads" },
                  { id: "vendor", label: "Vendors" },
                  { id: "listing", label: "Listings" },
                ] as const
              ).map((tab) => {
                const count = categoryCounts[tab.id];
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? "bg-[#1E5BFF] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 p-1.5">
            {filteredList.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                  <Inbox size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  No notifications in this category
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Live platform alerts, enquiries & vendor updates will appear here.
                </p>
              </div>
            ) : (
              filteredList.map((notif) => {
                const isLead = notif.category === "lead";
                const isVendor = notif.category === "vendor";
                const isListing = notif.category === "listing";

                return (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleNotificationClick(notif);
                      }
                    }}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition text-left ${
                      notif.isRead
                        ? "bg-white hover:bg-slate-50/80"
                        : "bg-blue-50/40 hover:bg-blue-50/70"
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl shrink-0 shadow-2xs ${
                        isLead
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/70"
                          : isVendor
                          ? "bg-blue-50 text-[#1E5BFF] border border-blue-200/70"
                          : isListing
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-200/70"
                          : "bg-amber-50 text-amber-600 border border-amber-200/70"
                      }`}
                    >
                      {isLead ? (
                        <Sparkles size={15} />
                      ) : isVendor ? (
                        <Building2 size={15} />
                      ) : isListing ? (
                        <Briefcase size={15} />
                      ) : (
                        <Shield size={15} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold leading-tight line-clamp-1 ${
                            notif.isRead ? "text-slate-800" : "text-slate-900 font-bold"
                          }`}
                        >
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock size={10} />
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[9px] font-bold tracking-wider text-slate-400">
                          {notif.category}
                        </span>
                      </div>
                    </div>

                    {/* Delete action on hover */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, notif._id)}
                      title="Dismiss notification"
                      className="absolute right-2.5 top-3 p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 px-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
            <Link
              href="/admin/leads"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 font-semibold text-[#1E5BFF] hover:text-blue-700 transition"
            >
              <span>View All Leads Pipeline</span>
              <ArrowRight size={13} />
            </Link>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
