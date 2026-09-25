import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/guard";
import { z } from "zod";
import mongoose from "mongoose";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  requiredRole: z.enum(["vendor", "superadmin", "admin", "user"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    const { email, password, requiredRole } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    // 1. Check in MarketplaceUser collection
    let user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    // 2. Also check if this email exists in legacy auths collection
    const existingAuth = await mongoose.connection.db
      ?.collection("auths")
      .findOne({ email: normalizedEmail });

    if (!user) {
      // User not in MarketplaceUser, verify against auths collection
      if (!existingAuth) {
        return apiError("Invalid email or password", 401);
      }

      if (existingAuth.status === "suspended" || existingAuth.isActive === false) {
        return apiError("Your account has been deactivated or suspended. Access denied.", 403);
      }

      const isLegacyMatch = await comparePassword(password, existingAuth.password);
      if (!isLegacyMatch) {
        return apiError("Invalid email or password", 401);
      }

      // Auto-sync admin into MarketplaceUser as superadmin
      user = await User.create({
        name: existingAuth.fullName || "Admin",
        email: normalizedEmail,
        passwordHash: existingAuth.password,
        role: "superadmin",
        status: "active",
      });
    } else {
      // User exists in MarketplaceUser
      let passwordMatched = false;

      // A) Try comparing against user.passwordHash if available
      if (user.passwordHash) {
        passwordMatched = await comparePassword(password, user.passwordHash);
      }

      // B) If not matched or no hash, check if auths has a valid password (admin sync)
      if (!passwordMatched && existingAuth && existingAuth.password) {
        const isAuthMatch = await comparePassword(password, existingAuth.password);
        if (isAuthMatch) {
          passwordMatched = true;
          // Synchronize updated password hash into marketplace_users
          user.passwordHash = existingAuth.password;
          await User.updateOne({ _id: user._id }, { $set: { passwordHash: existingAuth.password } });
        }
      }

      // Strictly fail if password did not match or no password hash exists
      if (!passwordMatched) {
        return apiError("Invalid email or password", 401);
      }
    }

    if (
      user.status === "suspended" ||
      (existingAuth &&
        (existingAuth.status === "suspended" || existingAuth.isActive === false))
    ) {
      return apiError("Your account has been deactivated or suspended. Access denied.", 403);
    }


    // 3. Strict Role Matching Check if requiredRole is specified
    if (requiredRole) {
      const userRole = user.role;
      const isReqAdmin = requiredRole === "superadmin" || requiredRole === "admin";
      const isUserAdmin = userRole === "superadmin";
      const isMatch = isReqAdmin ? isUserAdmin : userRole === requiredRole;

      if (!isMatch) {
        if (requiredRole === "vendor" && isUserAdmin) {
          return apiError(
            "This email is registered as an Enterprise Administrator, not a Coworking Partner. Please use the Admin Portal or Register as a Partner.",
            403,
            {
              code: "ROLE_MISMATCH",
              currentRole: userRole,
              requiredRole: "vendor",
              correctPortalUrl: "/admin/login",
              signupUrl: "/vendor/signup",
            }
          );
        }

        if (requiredRole === "vendor" && userRole === "user") {
          return apiError(
            "No partner account found for this email. This email is registered as a Client/Member. Please register as a Coworking Partner.",
            403,
            {
              code: "ROLE_MISMATCH",
              currentRole: userRole,
              requiredRole: "vendor",
              correctPortalUrl: "/login",
              signupUrl: "/vendor/signup",
            }
          );
        }

        if (isReqAdmin && userRole === "vendor") {
          return apiError(
            "Access Restricted: This account is registered as a Coworking Partner. Enterprise Admin requires administrative credentials.",
            403,
            {
              code: "ROLE_MISMATCH",
              currentRole: userRole,
              requiredRole: "superadmin",
              correctPortalUrl: "/vendor/login",
              signupUrl: "/admin/signup",
            }
          );
        }

        if (isReqAdmin && userRole === "user") {
          return apiError(
            "Access Restricted: Administrative privileges required. Please use the Client Portal.",
            403,
            {
              code: "ROLE_MISMATCH",
              currentRole: userRole,
              requiredRole: "superadmin",
              correctPortalUrl: "/login",
            }
          );
        }

        return apiError(
          `Access Restricted: Your account does not have '${requiredRole}' privileges.`,
          403,
          {
            code: "ROLE_MISMATCH",
            currentRole: userRole,
            requiredRole,
          }
        );
      }
    }

    const sessionPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      businessName: user.businessName,
    };

    const accessToken = generateAccessToken(sessionPayload);
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    const response = apiSuccess(
      {
        user: sessionPayload,
      },
      200,
      "Logged in successfully"
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error: any) {
    return apiError(error.message || "Login failed", 500);
  }
}
