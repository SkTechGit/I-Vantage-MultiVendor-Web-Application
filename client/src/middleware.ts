import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): { role?: string; id?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

type DashboardPortal = "admin" | "vendor" | "professional" | null;

function getDashboardFromReferer(referer: string | null): DashboardPortal {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    const path = url.pathname;
    if (
      path === "/dashboard/professional" ||
      path.startsWith("/dashboard/professional/")
    ) {
      return "professional";
    }
    if (
      path === "/admin" ||
      (path.startsWith("/admin/") &&
        path !== "/admin/login" &&
        path !== "/admin/signup")
    ) {
      return "admin";
    }
    if (
      path === "/vendor" ||
      (path.startsWith("/vendor/") &&
        path !== "/vendor/login" &&
        path !== "/vendor/signup")
    ) {
      return "vendor";
    }
  } catch {}
  return null;
}

function clearDashboardCookies(response: NextResponse, portal: DashboardPortal) {
  const namesToClear: string[] = [
    "accessToken",
    "refreshToken",
  ];

  if (portal === "admin") {
    namesToClear.push("iv_admin_token", "iv_admin_refresh");
  } else if (portal === "vendor") {
    namesToClear.push("iv_vendor_token", "iv_vendor_refresh");
  } else if (portal === "professional") {
    namesToClear.push("iv_pro_token", "iv_pro_refresh");
  } else {
    namesToClear.push(
      "iv_admin_token",
      "iv_admin_refresh",
      "iv_vendor_token",
      "iv_vendor_refresh",
      "iv_pro_token",
      "iv_pro_refresh"
    );
  }

  for (const name of namesToClear) {
    response.cookies.delete(name);
    response.cookies.set({
      name,
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  // Prevent caching of exit transition response
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass API endpoints and Next.js internal static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const isAdminRoute =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/signup");

  const isVendorRoute =
    pathname === "/vendor" ||
    (pathname.startsWith("/vendor/") &&
      pathname !== "/vendor/login" &&
      pathname !== "/vendor/signup");

  const isProfessionalRoute =
    pathname === "/dashboard/professional" ||
    pathname.startsWith("/dashboard/professional/");

  // 2. Auto-Signout Detection on Dashboard Exit
  // If the request came from an active dashboard (via referer) to any non-dashboard page,
  // immediately invalidate portal cookies so the user is auto-signed out.
  const isPrefetch =
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("x-middleware-prefetch") === "1" ||
    request.headers.get("next-router-prefetch") === "1";

  if (!isPrefetch) {
    const referer = request.headers.get("referer");
    const refererPortal = getDashboardFromReferer(referer);

    if (refererPortal) {
      const isTargetingSamePortal =
        (refererPortal === "admin" && isAdminRoute) ||
        (refererPortal === "vendor" && isVendorRoute) ||
        (refererPortal === "professional" && isProfessionalRoute);

      if (!isTargetingSamePortal) {
        // Exited dashboard! Clear auth cookies immediately
        const response = NextResponse.next();
        clearDashboardCookies(response, refererPortal);
        return response;
      }
    }
  }

  // 3. Explicit bypass for public professionals directory & consumer pages
  if (pathname.startsWith("/professionals")) {
    return NextResponse.next();
  }

  // 4. Multi-portal cookie resolution:
  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (isAdminRoute) {
    accessToken = request.cookies.get("iv_admin_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_admin_refresh")?.value || request.cookies.get("refreshToken")?.value;
  } else if (isVendorRoute) {
    accessToken =
      request.cookies.get("iv_vendor_token")?.value ||
      request.cookies.get("iv_admin_token")?.value ||
      request.cookies.get("accessToken")?.value;
    refreshToken =
      request.cookies.get("iv_vendor_refresh")?.value ||
      request.cookies.get("iv_admin_refresh")?.value ||
      request.cookies.get("refreshToken")?.value;
  } else if (isProfessionalRoute) {
    accessToken =
      request.cookies.get("iv_pro_token")?.value ||
      request.cookies.get("iv_admin_token")?.value ||
      request.cookies.get("accessToken")?.value;
    refreshToken =
      request.cookies.get("iv_pro_refresh")?.value ||
      request.cookies.get("iv_admin_refresh")?.value ||
      request.cookies.get("refreshToken")?.value;
  } else {
    accessToken =
      request.cookies.get("accessToken")?.value ||
      request.cookies.get("iv_pro_token")?.value ||
      request.cookies.get("iv_admin_token")?.value ||
      request.cookies.get("iv_vendor_token")?.value;
    refreshToken =
      request.cookies.get("refreshToken")?.value ||
      request.cookies.get("iv_pro_refresh")?.value ||
      request.cookies.get("iv_admin_refresh")?.value ||
      request.cookies.get("iv_vendor_refresh")?.value;
  }

  const hasToken = Boolean(accessToken || refreshToken);
  const tokenPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const rawRole = tokenPayload?.role;

  const isSuperAdmin =
    rawRole === "superadmin" ||
    rawRole === "super_admin";
  const isVendor = rawRole === "vendor";
  const isProfessional = rawRole === "professional" || isSuperAdmin;

  // 5. Unauthenticated checks for protected dashboard routes
  if (!hasToken) {
    if (isAdminRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isVendorRoute) {
      const loginUrl = new URL("/vendor/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isProfessionalRoute) {
      const loginUrl = new URL("/professional/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 6. Authenticated role checks
  if (hasToken) {
    if (isAdminRoute && !isSuperAdmin) {
      const adminLogin = new URL("/admin/login", request.url);
      adminLogin.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLogin);
    }

    if (pathname.startsWith("/vendor/leads")) {
      return NextResponse.redirect(new URL("/vendor", request.url));
    }

    if (isVendorRoute && !isVendor) {
      const vendorLogin = new URL("/vendor/login", request.url);
      vendorLogin.searchParams.set("from", pathname);
      return NextResponse.redirect(vendorLogin);
    }

    if (isProfessionalRoute && !isProfessional) {
      const loginUrl = new URL("/professional/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 7. For active dashboard responses, add strict no-store headers to prevent back-button cache exposure
  const response = NextResponse.next();
  if (isAdminRoute || isVendorRoute || isProfessionalRoute) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
  ],
};
