import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  icon: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
    return apiSuccess(categories);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch categories", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const slug = slugify(parsed.data.name);

    const category = await Category.create({
      ...parsed.data,
      slug,
    });

    return apiSuccess(category, 201, "Category created successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to create category", 500);
  }
}
