import asyncHandler from "../../utils/asyncHandler.js";
import * as blogService from "./blog.service.js";
import {
  createBlogSchema,
  updateBlogSchema,
  createCategorySchema,
  updateStatusSchema,
} from "./blog.validation.js";

/* -------------------------------------------------------------------------- */
/*                                Public APIs                                 */
/* -------------------------------------------------------------------------- */

export const getPublicBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.getPublicBlogs(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getFeaturedBlog = asyncHandler(async (req, res) => {
  const featured = await blogService.getFeaturedBlog();

  res.status(200).json({
    success: true,
    data: featured,
  });
});

export const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const result = await blogService.getPublicBlogBySlug(req.params.slug);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { blogId, categoryId, tags } = req.query;
  const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [];

  const related = await blogService.getRelatedBlogs(blogId, categoryId, tagsArray);

  res.status(200).json({
    success: true,
    data: related,
  });
});

export const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await blogService.getBlogCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getBlogTags = asyncHandler(async (req, res) => {
  const tags = await blogService.getBlogTags();

  res.status(200).json({
    success: true,
    data: tags,
  });
});

/* -------------------------------------------------------------------------- */
/*                                 Admin APIs                                 */
/* -------------------------------------------------------------------------- */

export const getAdminBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.getAdminBlogs(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getAdminBlogById = asyncHandler(async (req, res) => {
  const blog = await blogService.getAdminBlogById(req.params.id);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const validated = createBlogSchema.parse(req.body);
  const blog = await blogService.createBlog(validated, req.user._id);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const validated = updateBlogSchema.parse(req.body);
  const blog = await blogService.updateBlog(req.params.id, validated, req.user._id);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  const validated = updateStatusSchema.parse(req.body);
  const blog = await blogService.updateBlogStatus(
    req.params.id,
    validated.status,
    validated.scheduledAt,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: `Blog status changed to ${validated.status}`,
    data: blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const permanent = req.query.permanent === "true";
  const result = await blogService.deleteBlog(req.params.id, req.user._id, permanent);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getBlogDashboardStats = asyncHandler(async (req, res) => {
  const stats = await blogService.getBlogDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const createBlogCategory = asyncHandler(async (req, res) => {
  const validated = createCategorySchema.parse(req.body);
  const category = await blogService.createBlogCategory(validated);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
  const result = await blogService.deleteBlogCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const uploadBlogMedia = asyncHandler(async (req, res) => {
  const file = req.file;
  const result = await blogService.uploadBlogMedia(file);

  res.status(200).json({
    success: true,
    message: "Media uploaded successfully",
    data: result,
  });
});
