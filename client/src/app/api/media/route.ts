import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import MediaAsset from "@/models/MediaAsset";
import { z } from "zod";

const registerMediaSchema = z.object({
  cloudinaryPublicId: z.string().min(1, "Cloudinary public ID is required"),
  secureUrl: z.string().url("Valid secure URL is required"),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const uploadedByMe = searchParams.get("uploadedBy") === "me";

    const filter: any = {};
    if (auth.session.role === "vendor" || uploadedByMe) {
      filter.$or = [
        { uploadedBy: auth.session.id },
        { isGlobal: true },
        { secureUrl: { $regex: "^/images/workspace/" } },
      ];
    }

    const assets = await MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(assets);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch media assets", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = registerMediaSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();

    // Check if already registered
    let asset = await MediaAsset.findOne({
      cloudinaryPublicId: parsed.data.cloudinaryPublicId,
    });

    if (!asset) {
      asset = await MediaAsset.create({
        ...parsed.data,
        uploadedBy: auth.session.id,
      });
    }

    return apiSuccess(asset, 201, "Media asset registered successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to register media asset", 500);
  }
}
