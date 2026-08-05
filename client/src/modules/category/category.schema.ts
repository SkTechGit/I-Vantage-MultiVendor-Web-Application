import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required."),

  description: z
    .string()
    .trim()
    .min(5, "Description is required."),

  sortOrder: z.coerce.number(),

  isActive: z.boolean(),
});

export type CategoryFormData = z.infer<
  typeof categorySchema
>;