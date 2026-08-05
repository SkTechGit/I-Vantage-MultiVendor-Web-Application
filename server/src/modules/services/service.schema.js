import { z } from "zod";

export const createServiceSchema = z.object({
  category: z
    .string({
      required_error: "Category is required.",
    })
    .trim()
    .min(1, "Category is required."),

  name: z
    .string({
      required_error: "Service name is required.",
    })
    .trim()
    .min(2, "Service name must be at least 2 characters.")
    .max(100, "Service name cannot exceed 100 characters."),

  shortDescription: z
    .string({
      required_error: "Short description is required.",
    })
    .trim()
    .min(5, "Short description must be at least 5 characters.")
    .max(300, "Short description cannot exceed 300 characters."),

  sortOrder: z.coerce.number().default(0),

  isActive: z.coerce.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();