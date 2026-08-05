import { ReactNode } from "react";

import DashboardLayout from "@/modules/admin/components/DashboardLayout";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}