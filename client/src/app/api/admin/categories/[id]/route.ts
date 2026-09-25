import { NextRequest } from "next/server";
import { requireRole, apiError, apiSuccess } from "@/lib/guard";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 400);
    }

    await connectDB();
    const category = await Category.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!category) return apiError("Category not found", 404);

    return apiSuccess(category, 200, "Category updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update category", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["superadmin"]);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const category = await Category.findByIdAndDelete(id);
    if (!category) return apiError("Category not found", 404);

    return apiSuccess(null, 200, "Category deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete category", 500);
  }
}
