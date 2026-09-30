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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname === "/signup" ||
    pathname === "/vendor/login" ||
    pathname === "/vendor/signup";

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

  // Multi-portal cookie resolution:
  // On admin routes, check iv_admin_token first; on vendor routes, check iv_vendor_token first; then fallback to accessToken.
  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (isAdminRoute) {
    accessToken = request.cookies.get("iv_admin_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_admin_refresh")?.value || request.cookies.get("refreshToken")?.value;
  } else if (isVendorRoute) {
    accessToken = request.cookies.get("iv_vendor_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_vendor_refresh")?.value || request.cookies.get("refreshToken")?.value;
  } else {
    accessToken =
      request.cookies.get("accessToken")?.value ||
      request.cookies.get("iv_admin_token")?.value ||
      request.cookies.get("iv_vendor_token")?.value;
    refreshToken =
      request.cookies.get("refreshToken")?.value ||
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

  // 1. Unauthenticated checks
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
  }

  // 2. Authenticated role checks
  if (hasToken) {
    // Note: Do NOT auto-redirect away from auth pages (login/signup),
    // allowing users to freely switch accounts or log into different roles.

    // Role-based route protection for internal consoles:
    if (isAdminRoute && !isSuperAdmin) {
      // Non-superadmin trying to access enterprise admin console
      const adminLogin = new URL("/admin/login", request.url);
      adminLogin.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLogin);
    }

    if (isVendorRoute && !isVendor) {
      // Non-vendor (including SuperAdmin or regular user) trying to access vendor portal
      const vendorLogin = new URL("/vendor/login", request.url);
      vendorLogin.searchParams.set("from", pathname);
      return NextResponse.redirect(vendorLogin);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/login",
    "/signup",
    "/vendor/login",
    "/vendor/signup",
  ],
};