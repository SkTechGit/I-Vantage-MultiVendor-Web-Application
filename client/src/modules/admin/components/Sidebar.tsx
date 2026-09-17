"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/modules/auth/auth.api";

import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Users,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Newspaper,
  Images,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: typeof LayoutDashboard;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "CONTENT & SERVICES",
    items: [
      {
        title: "Blogs & CMS",
        href: "/admin/blogs",
        icon: Newspaper,
      },
      {
        title: "Media Assets",
        href: "/admin/media",
        icon: Images,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderOpen,
      },
      {
        title: "Services",
        href: "/admin/services",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "CUSTOMER OPS",
    items: [
      {
        title: "Leads",
        href: "/admin/leads",
        icon: Users,
      },
      {
        title: "CRM Pipeline",
        href: "/admin/crm",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        title: "Team & Access",
        href: "/admin/team",
        icon: ShieldCheck,
      },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      await refreshUser();
      toast.success("Logged out successfully.");
      router.refresh();
      router.push("/admin/login");
      onNavigate?.();
    } catch {
      toast.error("Logout failed.");
    }
  };

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "A";

  return (
    <aside
      className={clsx(
        "flex h-full flex-col justify-between border-r border-[#152B6E] bg-[#0B1F5E] text-white transition-all duration-200 ease-in-out select-none",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Top: Brand Area */}
      <div className="shrink-0">
        <div
          className={clsx(
            "flex h-16 sm:h-[68px] items-center border-b border-[#152B6E] px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white font-black text-sm shadow-xs">
                iV
              </div>
              <div className="min-w-0">
                <span className="block text-base font-extrabold tracking-tight text-white leading-none">
                  i-VANTAGE
                </span>
                <span className="block text-[10px] font-medium text-blue-300/80 tracking-wider uppercase mt-1">
                  Enterprise Workspace
                </span>
              </div>
            </div>
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white font-black text-sm shadow-xs"
              title="i-VANTAGE Enterprise"
            >
              iV
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={clsx(
                "hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-blue-200/70 hover:bg-[#152B6E] hover:text-white transition",
                isCollapsed && "hidden"
              )}
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Center: Navigation Menu with Categorized Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-blue-900">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            {!isCollapsed ? (
              <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-blue-300/60 uppercase">
                {group.label}
              </p>
            ) : (
              <div className="my-2 border-t border-[#152B6E]/60" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={isCollapsed ? item.title : undefined}
                  className={clsx(
                    "group relative flex items-center rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40",
                    isCollapsed
                      ? "h-10 w-10 justify-center mx-auto"
                      : "h-[42px] gap-3 px-3",
                    isActive
                      ? "bg-[#2563EB] text-white font-medium shadow-sm"
                      : "text-blue-100/80 hover:bg-[#132766] hover:text-white"
                  )}
                >
                  <Icon
                    size={18}
                    className={clsx(
                      "shrink-0 transition-transform duration-150",
                      isActive ? "text-white" : "text-blue-200/80 group-hover:text-white"
                    )}
                  />

                  {!isCollapsed && (
                    <span className="truncate text-xs font-medium">
                      {item.title}
                    </span>
                  )}

                  {/* Active Indicator Pip */}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/90" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: Signed-in User Info + Logout Action */}
      <div className="shrink-0 border-t border-[#152B6E] p-3 pb-5 sm:pb-6 space-y-2">
        {/* User Card (expanded only) */}
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-xl bg-[#09184A] p-2 border border-[#152B6E]/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {user?.fullName || "Admin User"}
              </p>
              <p className="truncate text-[10px] text-blue-300/70">
                {user?.email || "admin@ivantage.in"}
              </p>
            </div>
          </div>
        )}

        {/* Sidebar Expand trigger when collapsed */}
        {isCollapsed && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="hidden lg:flex h-10 w-10 mx-auto items-center justify-center rounded-xl text-blue-200 hover:bg-[#132766] hover:text-white transition"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Sign out" : undefined}
          className={clsx(
            "group flex items-center rounded-xl text-xs font-medium text-blue-200/80 transition-colors duration-150 hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400/40",
            isCollapsed
              ? "h-10 w-10 justify-center mx-auto"
              : "h-10 w-full gap-2.5 px-3"
          )}
        >
          <LogOut
            size={17}
            className="shrink-0 text-blue-300/70 group-hover:text-rose-300 transition-colors"
          />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}