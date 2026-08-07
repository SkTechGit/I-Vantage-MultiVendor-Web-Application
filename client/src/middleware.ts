import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  console.log("Path:", pathname);
  console.log("Token from middleware:", token ? "EXISTS" : "MISSING");

  const isLoginPage = pathname === "/login";

  const isProtectedRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/services") ||
    pathname.startsWith("/admin/leads") ||
    pathname.startsWith("/admin/crm");

  // No token → go to actual login page
  if (!token && isProtectedRoute) {
    console.log("No token → redirecting to /login");

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Token exists → don't allow login page
  if (token && isLoginPage) {
    console.log("Token exists → redirecting to dashboard");

    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};