import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, SessionPayload } from "./auth";
import { Role } from "@/types/marketplace";
import mongoose from "mongoose";

export function apiError(message: string, status = 400, extra: Record<string, any> = {}) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...extra,
    },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function requireAuth(
  req: NextRequest | Request
): Promise<{ session: SessionPayload } | { errorResponse: NextResponse }> {
  const session = await getSessionUser(req);
  if (!session) {
    return {
      errorResponse: apiError("Authentication required. Please log in.", 401),
    };
  }
  return { session };
}

export async function requireRole(
  req: NextRequest | Request,
  allowedRoles: Role[]
): Promise<{ session: SessionPayload } | { errorResponse: NextResponse }> {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth;
  }

  const { session } = auth;
  if (!allowedRoles.includes(session.role)) {
    return {
      errorResponse: apiError(
        `Forbidden: Role '${session.role}' is not authorized to access this resource.`,
        403
      ),
    };
  }

  return { session };
}

export function verifyVendorOwnership(
  session: SessionPayload,
  resourceVendorId?: string | mongoose.Types.ObjectId | null
): boolean {
  if (session.role === "superadmin") return true;
  if (!resourceVendorId) return false;
  return resourceVendorId.toString() === session.id;
}
