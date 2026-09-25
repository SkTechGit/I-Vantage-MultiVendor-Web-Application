"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { RealtimeProvider } from "@/context/RealtimeContext";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        {children}

        <Toaster
          richColors
          position="top-right"
        />
      </RealtimeProvider>
    </AuthProvider>
  );
}