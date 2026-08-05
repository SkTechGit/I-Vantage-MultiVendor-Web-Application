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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out.");

      router.refresh();
      router.push("/admin/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed.");
    }
  };

  return (
   <aside
  className="
    fixed
    left-0
    top-0
    z-40

    h-screen
    w-72

    overflow-y-auto

    bg-[#0A1F66]
    text-white
  "
>
      {/* Header */}
      <div className="border-b border-blue-800 p-6">
        <h2 className="text-2xl font-bold">I-Vantage</h2>

        <p className="text-sm text-blue-200">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={clsx(
                "mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                pathname === menu.href
                  ? "bg-[#1E5BFF]"
                  : "hover:bg-blue-900"
              )}
            >
              <Icon size={20} />
              <span>{menu.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-blue-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-blue-900"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}