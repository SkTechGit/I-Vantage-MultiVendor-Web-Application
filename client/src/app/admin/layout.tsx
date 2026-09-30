"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/modules/admin/components/DashboardLayout";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/signup");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}