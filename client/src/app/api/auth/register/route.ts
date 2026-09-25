import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/guard";
import { z } from "zod";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  role: z.enum(["vendor", "user"]).default("vendor"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    const { name, email, password, phone, businessName, role } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    const existing = await User.findOne({ email: normalizedEmail });
    const existingAuth = await mongoose.connection.db
      ?.collection("auths")
      .findOne({ email: normalizedEmail });

    if (existing || existingAuth) {
      const existingRole = existing?.role || (existingAuth ? "superadmin" : "user");
      if (existingRole === "superadmin") {
        return apiError(
          "This email is already registered as an Enterprise Administrator. Please use a separate business email for your vendor partner account, or log in to the Admin Console.",
          400,
          {
            code: "EMAIL_EXISTS_ADMIN",
            existingRole: "superadmin",
            targetPortal: "/admin/login",
          }
        );
      }
      if (existingRole === "vendor") {
        return apiError(
          "A vendor partner account with this email already exists. Please log in to your Partner Portal.",
          400,
          {
            code: "EMAIL_EXISTS_VENDOR",
            existingRole: "vendor",
            targetPortal: "/vendor/login",
          }
        );
      }
      return apiError("An account with this email already exists. Please log in.", 400);
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      phone,
      passwordHash,
      role,
      businessName: role === "vendor" ? businessName || `${name}'s Coworking` : undefined,
      status: "active",
    });

    const sessionPayload = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      businessName: newUser.businessName,
    };

    const accessToken = generateAccessToken(sessionPayload);
    const refreshToken = generateRefreshToken({
      id: newUser._id.toString(),
      email: newUser.email,
    });

    const response = apiSuccess(
      {
        user: sessionPayload,
      },
      201,
      "Account registered successfully"
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error: any) {
    return apiError(error.message || "Registration failed", 500);
  }
}
