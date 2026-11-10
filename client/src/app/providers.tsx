"use client";

import { ReactNode, useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { RealtimeProvider } from "@/context/RealtimeContext";
import DashboardAutoSignoutProvider from "@/components/auth/DashboardAutoSignoutProvider";
import { soundEngine } from "@/lib/soundEngine";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const interactiveSelector = [
      "button",
      "a[href]",
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="reset"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      'input[type="range"]',
      "select",
      "summary",
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="switch"]',
      '[role="slider"]',
      "[data-haptic]",
    ].join(",");

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !event.isPrimary) return;
      if (typeof window !== "undefined" && window.innerWidth > 820) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-haptic="off"], [aria-disabled="true"], :disabled')) {
        return;
      }

      const interactive = target.closest(interactiveSelector);
      if (
        interactive ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        soundEngine.playClick();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

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