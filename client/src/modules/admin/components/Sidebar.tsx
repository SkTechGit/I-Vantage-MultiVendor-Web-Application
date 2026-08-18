"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";

import { logout } from "@/modules/auth/auth.api";

import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
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
  {
    title: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    title: "CRM",
    href: "/admin/crm",
    icon: ClipboardList,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out.");

      router.refresh();
      router.push("/admin/login");

      onNavigate?.();
    } catch (error) {
      console.error(error);

      toast.error("Logout failed.");
    }
  };

  return (
    <aside
      className="
        flex
        h-full
        w-72
        flex-col
        overflow-y-auto
        bg-[#0A1F66]
        text-white
      "
    >
      {/* Header */}
      <div className="shrink-0 border-b border-blue-800 p-3">
        <h2 className="text-2xl font-bold">
          i-VANTAGE
        </h2>

        <p className="mt-1 text-sm text-blue-200">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const isActive =
            pathname === menu.href ||
            pathname.startsWith(`${menu.href}/`);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onNavigate}
              className={clsx(
                "mb-2 flex items-center gap-3 rounded-xl px-4 py-3",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-400",
                isActive
                  ? "bg-[#1E5BFF] text-white"
                  : "text-blue-100 hover:bg-blue-900"
              )}
            >
              <Icon size={20} className="shrink-0" />

              <span className="truncate">
                {menu.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-blue-800 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-blue-100
            transition-colors
            duration-200
            hover:bg-blue-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        >
          <LogOut size={20} className="shrink-0" />

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}