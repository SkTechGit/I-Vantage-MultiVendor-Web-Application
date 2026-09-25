import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    await connectDB();
    const user = await User.findById(session.id).lean();

    if (user?.status === "suspended") {
      return apiError("Your account has been deactivated or suspended.", 403);
    }

    // Also check auths collection for complete dual-collection enforcement
    const existingAuth = await mongoose.connection.db
      ?.collection("auths")
      .findOne({ email: session.email?.toLowerCase().trim() });

    if (
      existingAuth &&
      (existingAuth.status === "suspended" || existingAuth.isActive === false)
    ) {
      return apiError("Your account has been deactivated or suspended.", 403);
    }

    return apiSuccess({
      ...session,
      phone: user?.phone,
      status: user?.status,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch session", 500);
  }
}
