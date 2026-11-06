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

  // Explicit bypass for public professionals directory & consumer pages
  if (pathname.startsWith("/professionals")) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname === "/signup" ||
    pathname === "/vendor/login" ||
    pathname === "/vendor/signup" ||
    pathname === "/professional/login" ||
    pathname === "/professional/signup" ||
    pathname === "/professional/register";

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

  // Multi-portal cookie resolution:
  // On admin routes, check iv_admin_token first; on vendor routes, check iv_vendor_token; on professional routes, check iv_pro_token.
  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (isAdminRoute) {
    accessToken = request.cookies.get("iv_admin_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_admin_refresh")?.value || request.cookies.get("refreshToken")?.value;
  } else if (isVendorRoute) {
    accessToken = request.cookies.get("iv_vendor_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_vendor_refresh")?.value || request.cookies.get("refreshToken")?.value;
  } else if (isProfessionalRoute) {
    accessToken = request.cookies.get("iv_pro_token")?.value || request.cookies.get("accessToken")?.value;
    refreshToken = request.cookies.get("iv_pro_refresh")?.value || request.cookies.get("refreshToken")?.value;
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
    if (isProfessionalRoute) {
      const loginUrl = new URL("/professional/login", request.url);
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

    if (pathname.startsWith("/vendor/leads")) {
      return NextResponse.redirect(new URL("/vendor", request.url));
    }

    if (isVendorRoute && !isVendor) {
      // Non-vendor (including SuperAdmin or regular user) trying to access vendor portal
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/dashboard/professional/:path*",
    "/login",
    "/signup",
    "/vendor/login",
    "/vendor/signup",
    "/professional/login",
    "/professional/signup",
    "/professional/register",
    "/professional/:path*",
  ],
};