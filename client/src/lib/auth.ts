import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Role } from "@/types/marketplace";
import connectDB from "./db";
import User from "@/models/User";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  "bfc9a3775f408f50ef4543500324b51af6030b6d0990f510111e2a99a6d6bf69";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "ea256a156e362d78faeb428790bddf127973328135bae01ab79a7a731fe9d5c4";
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "7d";
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "30d";

export interface SessionPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
  businessName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as any;
    let role: Role = "user";
    if (
      decoded.role === "superadmin" ||
      decoded.role === "super_admin" ||
      decoded.role === "admin"
    ) {
      role = "superadmin";
    } else if (decoded.role === "vendor") {
      role = "vendor";
    }

    return {
      id: decoded.id || decoded._id,
      email: decoded.email,
      role,
      name: decoded.name || decoded.fullName || "",
      businessName: decoded.businessName,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(
  req?: NextRequest | Request
): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/accessToken=([^;]+)/);
        if (match) token = match[1];
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("accessToken")?.value;
    } catch {
      // Not in Next.js Server Component / Action context
    }
  }

  if (!token) return null;

  const session = verifyAccessToken(token);
  if (!session) return null;

  // Verify status & live role from DB
  try {
    await connectDB();
    const query: any[] = [];
    if (session.id && mongoose.Types.ObjectId.isValid(session.id)) {
      query.push({ _id: new mongoose.Types.ObjectId(session.id) });
    }
    if (session.email) {
      query.push({ email: session.email.toLowerCase().trim() });
    }
    const dbUser = query.length > 0 ? await User.findOne({ $or: query }) : null;
    if (dbUser) {
      if (dbUser.status === "suspended") {
        return null;
      }
      if (dbUser.role) {
        session.role = dbUser.role as Role;
      }
      if (dbUser.name) {
        session.name = dbUser.name;
      }
      if (dbUser.businessName) {
        session.businessName = dbUser.businessName;
      }
    }
  } catch {
    // If DB check fails, still fall back to token validity
  }

  return session;
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}
