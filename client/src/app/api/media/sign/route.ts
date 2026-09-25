import { NextRequest, NextResponse } from "next/server";
import { requireRole, apiSuccess } from "@/lib/guard";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || `ivantage/vendors/${auth.session.id}`;
    const signData = generateUploadSignature(folder);

    return apiSuccess(signData, 200, "Signed upload parameters generated");
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
