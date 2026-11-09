"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type DashboardPortal = "admin" | "vendor" | "professional" | null;

export function getDashboardPortal(pathname: string | null): DashboardPortal {
  if (!pathname) return null;

  // Professional Dashboard
  if (
    pathname === "/dashboard/professional" ||
    pathname.startsWith("/dashboard/professional/")
  ) {
    return "professional";
  }

  // Admin Panel (excluding login & signup)
  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/signup")
  ) {
    return "admin";
  }

  // Vendor Dashboard (excluding login & signup)
  if (
    pathname === "/vendor" ||
    (pathname.startsWith("/vendor/") &&
      pathname !== "/vendor/login" &&
      pathname !== "/vendor/signup")
  ) {
    return "vendor";
  }

  return null;
}

const STORAGE_ACTIVE_PORTAL_KEY = "iv_active_dashboard_portal";

const clearClientAuthArtifacts = (portal: DashboardPortal) => {
  if (typeof window === "undefined") return;

  // 1. Clear LocalStorage keys
  const keysToRemove = [
    "iv_user",
    "iv_admin_user",
    "iv_vendor_user",
    "iv_pro_user",
    "cached_user",
  ];
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  });

  // 2. Clear SessionStorage active portal tracker
  try {
    sessionStorage.removeItem(STORAGE_ACTIVE_PORTAL_KEY);
  } catch {}

  // 3. Clear non-httpOnly document cookies if any exist
  const cookiesToClear = [
    "iv_admin_token",
    "iv_admin_refresh",
    "iv_vendor_token",
    "iv_vendor_refresh",
    "iv_pro_token",
    "iv_pro_refresh",
    "accessToken",
    "refreshToken",
  ];
  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    if (window.location.hostname.includes(".")) {
      const parts = window.location.hostname.split(".");
      if (parts.length >= 2) {
        const rootDomain = "." + parts.slice(-2).join(".");
        document.cookie = `${name}=; Path=/; Domain=${rootDomain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
      }
    }
  });

  // 4. Dispatch custom event for immediate subscriber updates
  window.dispatchEvent(
    new CustomEvent("portal-auto-signed-out", {
      detail: { portal },
    })
  );
};

const triggerBackendLogout = (portal: DashboardPortal) => {
  const portalParam = portal || "all";
  const url = `/api/v1/auth/logout?portal=${encodeURIComponent(portalParam)}`;

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ portal: portalParam })], {
        type: "application/json",
      });
      navigator.sendBeacon(url, blob);
    }
  } catch {}

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal: portalParam }),
      keepalive: true,
      credentials: "include",
    }).catch(() => {});
  } catch {}
};

export default function DashboardAutoSignoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setUser } = useAuth();
  const currentPortal = getDashboardPortal(pathname);
  const prevPortalRef = useRef<DashboardPortal>(currentPortal);

  useEffect(() => {
    // Check if previous portal was in a dashboard and the new route has exited that dashboard
    const prevPortal = prevPortalRef.current;

    // Also check sessionStorage to catch hard-reload / address bar navigations out of dashboard
    let storedPortal: DashboardPortal = null;
    try {
      storedPortal = sessionStorage.getItem(STORAGE_ACTIVE_PORTAL_KEY) as DashboardPortal;
    } catch {}

    const exitedPortal =
      (prevPortal && prevPortal !== currentPortal)
        ? prevPortal
        : (storedPortal && storedPortal !== currentPortal)
        ? storedPortal
        : null;

    if (exitedPortal) {
      // User has exited the dashboard portal!
      console.info(
        `[AutoSignout] Exited dashboard portal '${exitedPortal}' to '${pathname}'. Terminating session immediately.`
      );

      // Immediately clear in-memory user state
      setUser(null);

      // Clear local storage and client cookies
      clearClientAuthArtifacts(exitedPortal);

      // Trigger backend cookie invalidation
      triggerBackendLogout(exitedPortal);
    }

    // Update active tracker
    if (currentPortal) {
      try {
        sessionStorage.setItem(STORAGE_ACTIVE_PORTAL_KEY, currentPortal);
      } catch {}
    } else {
      try {
        sessionStorage.removeItem(STORAGE_ACTIVE_PORTAL_KEY);
      } catch {}
    }

    prevPortalRef.current = currentPortal;
  }, [pathname, currentPortal, setUser]);

  return <>{children}</>;
}
