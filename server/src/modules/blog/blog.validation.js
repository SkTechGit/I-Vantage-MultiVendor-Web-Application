import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  slug: z.string().trim().optional(),

  excerpt: z
    .string({ required_error: "Excerpt is required" })
    .trim()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt cannot exceed 500 characters"),

  content: z
    .string({ required_error: "Content is required" })
    .min(10, "Content must be at least 10 characters"),

  coverImage: z.object({
    url: z.string({ required_error: "Cover image URL is required" }).url("Invalid cover image URL"),
    publicId: z.string().optional().default(""),
    alt: z.string().optional().default(""),
    caption: z.string().optional().default(""),
  }),

  status: z
    .enum(["draft", "published", "scheduled", "archived"])
    .default("draft"),

  featured: z.boolean().optional().default(false),

  category: z.string({ required_error: "Category ID is required" }).trim().min(1),

  tags: z.array(z.string().trim()).optional().default([]),

  author: z.string().optional(),

  scheduledAt: z.string().nullable().optional(),

  seoTitle: z.string().max(100).optional().default(""),

  seoDescription: z.string().max(200).optional().default(""),

  seoKeywords: z.array(z.string().trim()).optional().default([]),

  canonicalUrl: z.string().optional().default(""),

  ogTitle: z.string().optional().default(""),

  ogDescription: z.string().optional().default(""),

  ogImage: z
    .object({
      url: z.string().optional().default(""),
      publicId: z.string().optional().default(""),
    })
    .optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(60, "Category name cannot exceed 60 characters"),

  description: z.string().trim().optional().default(""),

  seoTitle: z.string().trim().max(100).optional().default(""),

  seoDescription: z.string().trim().max(200).optional().default(""),

  sortOrder: z.number().optional().default(0),
});

export const updateStatusSchema = z.object({
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  scheduledAt: z.string().nullable().optional(),
});
