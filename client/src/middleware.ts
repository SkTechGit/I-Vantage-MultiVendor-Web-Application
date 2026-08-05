import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";

  const isProtectedRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/services") ||
    pathname.startsWith("/admin/leads") ||
    pathname.startsWith("/admin/crm");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};