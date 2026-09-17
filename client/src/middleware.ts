import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasToken = Boolean(accessToken || refreshToken);
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname === "/signup";

  const isProtectedRoute =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/signup");

  // No token → go to login page
  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Token exists → don't allow auth pages, redirect to dashboard
  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};