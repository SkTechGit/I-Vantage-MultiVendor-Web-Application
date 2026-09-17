"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Shield,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/modules/auth/auth.api";

interface Props {
  onOpenMobileSidebar?: () => void;
  onOpenCommandPalette?: () => void;
}

const ROUTE_NAMES: Record<string, { label: string; group: string }> = {
  "/admin/dashboard": { label: "Dashboard", group: "Overview" },
  "/admin/blogs": { label: "Blogs & CMS", group: "Content" },
  "/admin/media": { label: "Media Assets", group: "Content" },
  "/admin/categories": { label: "Categories", group: "Catalog" },
  "/admin/services": { label: "Services", group: "Catalog" },
  "/admin/leads": { label: "Leads", group: "Customer Operations" },
  "/admin/crm": { label: "CRM", group: "Customer Operations" },
  "/admin/team": { label: "Team & Access", group: "Administration" },
};

export default function Header({
  onOpenMobileSidebar,
  onOpenCommandPalette,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await refreshUser();
      toast.success("Successfully logged out.");
      router.refresh();
      router.push("/admin/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const currentRoute = ROUTE_NAMES[pathname] || {
    label: "Admin Console",
    group: "Workspace",
  };

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "A";

  const userDisplayName = user?.fullName || "Admin User";
  const userRole = user?.role
    ? user.role.replace("_", " ").toUpperCase()
    : "SUPER ADMIN";

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-[68px] w-full items-center justify-between border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 transition-colors">
      {/* Left: Mobile hamburger + Clean Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 lg:hidden"
        >
          <Menu size={19} />
        </button>

        {/* Breadcrumb Context */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
          <span className="text-slate-400 font-normal hidden md:inline">
            i-VANTAGE
          </span>
          <ChevronRight size={14} className="text-slate-300 hidden md:inline" />
          <span className="text-slate-500 hidden sm:inline">
            {currentRoute.group}
          </span>
          <ChevronRight size={14} className="text-slate-300 hidden sm:inline" />
          <span className="font-semibold text-slate-900 truncate">
            {currentRoute.label}
          </span>
        </nav>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md px-4">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="group flex h-9 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
        >
          <span className="flex items-center gap-2">
            <Search size={15} className="text-slate-400 group-hover:text-slate-600" />
            <span>Quick search commands, pages...</span>
          </span>
          <span className="flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 shadow-2xs">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden"
        >
          <Search size={18} />
        </button>

        {/* Public Site Shortcut */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Public Website"
          className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <span>View Site</span>
          <ExternalLink size={13} className="text-slate-400" />
        </Link>

        {/* Notification Bell Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen((prev) => !prev)}
            aria-label="Notifications"
            className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition ${
              notificationOpen
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Notifications
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                    Active
                  </span>
                </div>
                <span className="text-xs text-slate-400">Live System</span>
              </div>

              <div className="divide-y divide-slate-100 py-1 max-h-64 overflow-y-auto">
                <div className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">
                      System Operational
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Database connected, authentication active.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Just now
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">
                      Lead Pipeline Active
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      New enquiries are syncing automatically with CRM.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Automated monitor
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 px-2">
                <Link
                  href="/admin/leads"
                  onClick={() => setNotificationOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  View all leads pipeline →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1 sm:pr-2.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0B1F5E] text-xs sm:text-sm font-bold text-white shadow-2xs">
              {userInitial}
            </div>

            <div className="hidden text-left lg:block max-w-[120px]">
              <p className="truncate text-xs font-semibold text-slate-900">
                {userDisplayName}
              </p>
              <p className="truncate text-[10px] font-medium text-slate-400">
                {userRole}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-150 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100 z-50">
              {/* User Identity Info */}
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">
                  {userDisplayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user?.email || "Admin session"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  <Shield size={11} />
                  <span>{userRole}</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <Link
                  href="/admin/team"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <Shield size={15} className="text-slate-400" />
                  <span>Team & Security</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <Sparkles size={15} className="text-slate-400" />
                  <span>Workspace Overview</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}