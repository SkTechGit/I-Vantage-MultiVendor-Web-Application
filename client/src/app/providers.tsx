"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { RealtimeProvider } from "@/context/RealtimeContext";
import DashboardAutoSignoutProvider from "@/components/auth/DashboardAutoSignoutProvider";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardAutoSignoutProvider>
        <RealtimeProvider>
          {children}

          <Toaster
            richColors
            position="top-right"
          />
        </RealtimeProvider>
      </DashboardAutoSignoutProvider>
    </AuthProvider>
  );
}