import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required."),

  description: z
    .string()
    .trim()
    .optional(),

  sortOrder: z
    .coerce
    .number()
    .default(0),

  isActive: z
    .coerce
    .boolean()
    .default(true),
});

export const updateCategorySchema =
  createCategorySchema.partial();